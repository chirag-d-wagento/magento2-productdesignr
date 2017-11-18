<?php

namespace Develo\Designer\Observer\Adminhtml;

use \Magento\Framework\Event\ObserverInterface;
use \Magento\Framework\Event\Observer as EventObserver;
use \Develo\Designer\Ui\DataProvider\Product\Form\Modifier\Designer;

use Magento\Framework\Stdlib\DateTime\DateTime;

class ProductSaveAfter implements ObserverInterface {

    protected $_productLoader;
    protected $_groupImageModel;
    protected $_imageModel;
    protected $_designerModel;
    protected $_date;
    protected $_request;

    public function __construct(
        \Develo\Designer\Model\ImageFactory $imageFactory,
        \Develo\Designer\Model\ImagegroupFactory $imagegroupFactory , 
        \Develo\Designer\Model\Designer $designerModel, 
        \Magento\Framework\App\RequestInterface $request,    
        DateTime $date   
    ) {
        
        $this->_groupImageModel = $imagegroupFactory;
        $this->_imageModel      = $imageFactory;
        $this->_date = $date;
        $this->_designerModel = $designerModel;
        $this->_request = $request;
    }
    
    /**
     * @param EventObserver $observer
     */
    public function execute(\Magento\Framework\Event\Observer $observer) {
        /** @var \Magento\Catalog\Model\Product $product */
        $product = $observer->getEvent()->getProduct();
        if (!$product) {
            return;
        }

        $productId = $product->getId();
        $posts = $this->_request->getParams();
        $postsProduct = !empty($posts['product']) ? $posts['product'] : null;
        if(!$postsProduct) {
            return;
        }
        if(array_key_exists(Designer::FIELD_NAME_TEXT, $postsProduct)) {
            $data = $postsProduct[Designer::FIELD_NAME_TEXT];
            $this->_saveData($data, $productId);
        }
        
    }
    
    
    protected function _saveData($data, $productId) {
        $this->_clearGroups($productId);
        $dataArr = json_decode($data);
        $dataArr = $dataArr ? $dataArr : [];
        $c = 0;
        foreach($dataArr as $group) {
            $groupId = $this->saveGroup($group, $productId, $c);
            $imgs = $group->imgs;
            $imgs = $imgs ? $imgs : [];
            $im = 0;
            foreach($imgs as $img) {
                $this->saveImg($img, $groupId, $productId, $im);
                $im++;
            }   
            $c++;
        }
    }
    
    protected function saveGroup($group, $productId, $priority) {
        $groupModel = $this->_groupImageModel->create();
        $groupModel->setPriority($priority)
                ->setCreatedTime($this->_date->gmtDate());
        
        $groupModel->setGroupUid($group->group_uid);
        $groupModel->setSystemProductId($productId);
        $groupModel->save();
        
        return $groupModel->getId();
    }
    
    protected function saveImg($image, $groupId, $productId, $priority) {
        $imageModel = $this->_imageModel->create();
        
        $imageModel->setPriority($priority)
                ->setMediaId($image->media_id)
                ->setGroupId($groupId)
                ->setSystemChildProductId($image->product_id)
                ->setCreatedTime($this->_date->gmtDate())
                ->setImageSrc($image->src);
        
        $config = $this->_designerModel->prepareConfig($image);
        $imageModel->setConfig($config);
        $imageModel->setExtraConfig(!empty($image->extra_config) ? json_encode($image->extra_config) : json_encode([]));
        $imageModel->save();
    }
    
    protected function _clearGroups($productId) {
        $collection = $this->_groupImageModel->create()
                ->getCollection();
        
        $collection->getSelect()->where('system_product_id=?', $productId);
        foreach($collection as $group) {
            $this->_clearImages($group->getId());
            $group->delete();
        }
    }
    
    protected function _clearImages($groupId) {
        $collection = $this->_imageModel->create()
                ->getCollection();
        
        $collection->getSelect()->where('group_id=?', $groupId);
        foreach($collection as $image) {
            $image->delete();
        }
    }

}
