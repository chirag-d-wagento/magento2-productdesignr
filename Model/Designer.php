<?php

namespace Develo\Designer\Model;

use Magento\ConfigurableProduct\Api\LinkManagementInterface;

class Designer {

    protected $_imageModel;
    protected $_groupImageModel;
    protected $_productLoader;
    protected $_loadedProducts = [];
    protected $_linkManagement;
    protected $_productRepo;
    protected $_fileSystem;

    public function __construct(
        \Develo\Designer\Model\ImageFactory $imageModel, 
        \Magento\Framework\Filesystem $fileSystem, 
        \Develo\Designer\Model\ImagegroupFactory $groupImageModel, 
        LinkManagementInterface $linkManagement, 
        \Magento\Catalog\Api\ProductRepositoryInterface $productRepo, 
        \Magento\Catalog\Model\ProductFactory $productLoader
    ) {
        $this->_groupImageModel = $groupImageModel;
        $this->_imageModel = $imageModel;
        $this->_productLoader = $productLoader;
        $this->_linkManagement = $linkManagement;
        $this->_productRepo = $productRepo;
        $this->_fileSystem = $fileSystem;
    }

    public function loadFrontConfiguration($product) {

        $defaultConf = $this->loadConfguration($product->getId());
        if ($product->getTypeId() == 'configurable') {
            return $this->_prepareConfgurableProductConfiguration($product, $defaultConf);
        } else {
            return $this->_prepareSimpleProductConfiguration($product, $defaultConf);
        }
    }

    protected function _prepareSimpleProductConfiguration($product, $defaultConf = []) {
        if($this->_checkdefaultConfForProductId($defaultConf, $product->getId())) {
            return $defaultConf;
        }
        
        $media = $product->getMediaGalleryImages();
        $groupId = uniqid();
        
        return [
            [
                'group_uid' => uniqid(),
                'imgs' => [$this->_prepareDefaultImg($media, $groupId, $product)],
                'product_id' => $product->getId()
            ],
            
        ];
    }

    protected function _prepareConfgurableProductConfiguration($product, $defaultConf = []) {
        $out = [];
        $childProducts = $this->_linkManagement
                ->getChildren($product->getSku());

        foreach ($childProducts as $child) {
            $childProduct = $this->_getProduct($child->getSku(), true);
            if($conf = $this->_checkdefaultConfForProductId($defaultConf, $childProduct->getId())) {
                $out[] = $conf;
                continue;
            }
            
            $media = $childProduct->getMediaGalleryImages();
            $groupId = uniqid();
            $imgs = $this->_prepareDefaultImg($media, $groupId, $childProduct);
            if($imgs) {
                $out[] = [
                    'group_uid' => $groupId,
                    'imgs' => [$this->_prepareDefaultImg($media, $groupId, $childProduct)],
                    'product_id' => $childProduct->getId()
                ];
            }
        }
        
        return $out;
    }

    protected function _prepareDefaultImg($medias, $groupId, $product) {
        foreach($medias as $media) {
            
            if(!$this->getMediaSizes($media)) {
                return;
            }
            
            //$sizes = 
            return [
                'conf' => [],
                'group_index' => $groupId,
                'media_id' => $media->getId(),
                'product_id' => $product->getId(),
                'sku' => $product->getSku(),
                'src' => $media->getUrl(),
                'media_id' => $media->getId(),
                'sizes' => $this->getMediaSizes($media)
            ];
        }
    }
    
    protected function _checkdefaultConfForProductId($defaultConf = [], $productId) {
        
        foreach($defaultConf as $conf) {
            if($conf['product_id'] == $productId) {
                return $conf;
            }
        }
        
        return false;
    }
    
    protected function getMediaSizes($media) {
        $file = $media->getFile();
        $mediaPath = $this->_fileSystem->
                getDirectoryRead(\Magento\Framework\App\Filesystem\DirectoryList::MEDIA)
                ->getAbsolutePath();
        $fullPath =  $mediaPath . 'catalog/product' . $file;
        
        if(file_exists($fullPath)) {
            $sizes = getimagesize($fullPath);
            return [
                'width' => $sizes[0],
                'height' => $sizes[1],
            ];
        }
        
        return false;
    }

    public function loadConfguration($productId) {
        $out = [];
        $groups = $this->getGroups($productId);

        if ($groups->getSize()) {
            foreach ($groups as $group) {
                $this->_currentGroupProductId = null;
                $out[] = [
                    'group_uid' => $group->getGroupUid(),
                    'imgs' => $this->prepareImgsOut($group),
                    'product_id' => $this->_currentGroupProductId
                ];
            }
        }

        return $out;
    }

    protected function prepareImgsOut($group) {
        $out = [];
        $images = $this->getGroupImages($group->getId());

        if ($images->getSize()) {
            foreach ($images as $image) {
                $product = $this->_getProduct($image->getSystemChildProductId());
                if (!$product->getId()) {
                    continue;
                }
                if (!$this->_currentGroupProductId) {
                    $this->_currentGroupProductId = $product->getId();
                }
                $imgArr = [
                    'src' => $image->getImageSrc(),
                    'media_id' => $image->getMediaId(),
                    'group_index' => $group->getGroupUid(),
                    'sku' => $product->getSku(),
                    'product_id' => $product->getId(),
                    'extra_config' => $this->getImgExtraConf($image)
                ];
                $imgConf = $this->getImgConf($image);
                $out[] = array_merge($imgArr, $imgConf);
            }
        }

        return $out;
    }
    
    protected function getImgExtraConf($image) {
        $out = [];
        $extraConf = $image->getExtraConfig();
        if ($extraConf) {
            $out = json_decode($extraConf, true);
        }

        return $out;
    }

    protected function getImgConf($image) {
        $out = [];
        $conf = $image->getConfig();
        if ($conf) {
            $out = json_decode($conf, true);
        }

        return $out;
    }

    protected function getGroupImages($groupId) {
        $imageCollection = $this->_imageModel->create()
                ->getCollection();

        $imageCollection->getSelect()
                ->where('group_id=?', $groupId)
                ->order('priority');

        return $imageCollection;
    }

    protected function getGroups($productId) {
        $groupsCollection = $this->_groupImageModel->create()
                ->getCollection();

        $groupsCollection->getSelect()
                ->where('system_product_id=?', $productId)
                ->order('priority');

        return $groupsCollection;
    }

    protected function _getProduct($productId, $bySku = false) {
        if (!empty($this->_loadedProducts[$productId])) {
            return $this->_loadedProducts[$productId];
        }

        if ($bySku) {
            $this->_loadedProducts[$productId] = $this->_productRepo->get($productId);
        } else {
            $this->_loadedProducts[$productId] = $this->_productLoader->create()
                    ->load($productId);
        }
        return $this->_loadedProducts[$productId];
    }

    public function prepareConfig($imgArr) {
        $saveArr = [];
        $imgArr = get_object_vars($imgArr);
        if (!empty($imgArr['sizes'])) {
            $saveArr['sizes'] = $imgArr['sizes'];
        }
        if (!empty($imgArr['mask'])) {
            $saveArr['mask'] = $imgArr['mask'];
        }
        if (!empty($imgArr['conf'])) {
            $saveArr['conf'] = $imgArr['conf'];
        }

        return json_encode($saveArr);
    }

}
