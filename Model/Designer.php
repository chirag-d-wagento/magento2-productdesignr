<?php

namespace Develo\Designer\Model;

class Designer{
    
    protected $_imageModel;
    
    protected $_groupImageModel;
    
    protected $_productLoader;
    
    protected $_loadedProducts = [];
    
    public function __construct(
        \Develo\Designer\Model\ImageFactory $imageModel,
        \Develo\Designer\Model\ImagegroupFactory $groupImageModel,
        \Magento\Catalog\Model\ProductFactory $productLoader
    ) {
        $this->_groupImageModel = $groupImageModel;
        $this->_imageModel = $imageModel;
        $this->_productLoader = $productLoader;
    }
    
    public function loadConfguration($productId) {
        $out = [];
        $groups = $this->getGroups($productId);
        
        if($groups->getSize()) {
            foreach($groups as $group) {
                $out[] = [
                    'group_uid' => $group->getGroupUid(),
                    'imgs' => $this->prepareImgsOut($group)
                ];
            }
        }
        
        return $out;
    }
    
    protected function prepareImgsOut($group) {
        $out = [];
        $images = $this->getGroupImages($group->getId());
        
        if($images->getSize()) {
            foreach($images as $image) {
                $product = $this->_getProduct($image->getSystemChildProductId());
                if(!$product->getId()) {
                    continue;
                }
                $imgArr = [
                    'src' => $image->getImageSrc(),
                    'media_id' => $image->getMediaId(),
                    'group_index' => $group->getGroupUid(),
                    'sku' => $product->getSku(),
                    'product_id' => $product->getId(),
                ]; 
                $imgConf = $this->getImgConf($image);
                $out[] = array_merge($imgArr, $imgConf);
            }
        }
        
        return $out;
    }
    
    protected function getImgConf($image) {
        $out = [];
        $conf = $image->getConfig(); 
        if($conf) {
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
    
    protected function _getProduct($productId) {
        if(!empty($this->_loadedProducts[$productId])) {
            return $this->_loadedProducts[$productId];
        }
        
        $this->_loadedProducts[$productId] = $this->_productLoader->create()
                ->load($productId);
        
        return $this->_loadedProducts[$productId];
    }
    
    public function prepareConfig($imgArr) {
        $saveArr = [];
        $imgArr = get_object_vars($imgArr);
        if(!empty($imgArr['sizes'])) {
            $saveArr['sizes'] = $imgArr['sizes'];
        }
        if(!empty($imgArr['mask'])) {
            $saveArr['mask'] = $imgArr['mask'];
        }
        if(!empty($imgArr['conf'])) {
            $saveArr['conf'] = $imgArr['conf'];
        }
        
        return json_encode($saveArr);
    }
    
}
