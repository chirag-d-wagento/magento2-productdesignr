<?php

namespace Develo\Designer\Controller\Adminhtml\Group;

use Magento\Framework\Stdlib\DateTime\DateTime;

class Save extends \Magento\Backend\App\Action {
    
    protected $_productLoader;
    protected $_groupImageModel;
    protected $_imageModel;
    protected $_designerModel;
    protected $_date;
    
    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Develo\Designer\Model\ImageFactory $imageFactory,
        \Develo\Designer\Model\ImagegroupFactory $imagegroupFactory , 
        \Develo\Designer\Model\Designer $designerModel,    
        DateTime $date   
    ) {
        parent::__construct($context);
        $this->_groupImageModel = $imagegroupFactory;
        $this->_imageModel      = $imageFactory;
        $this->_date = $date;
        $this->_designerModel = $designerModel;
    }
    
    
    public function execute() {
        $data = $this->getRequest()->getParam('data');
        $productId = $this->getRequest()->getParam('product_id');
        
        $this->_saveData($data, $productId);
        
        var_dump($productId);
        var_dump($data);
        
        return;
        
        $this->sendResponse([
            'success' => true
        ]);
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
        $imageModel->setExtraConfig($image->extra_config ? json_encode($image->extra_config) : json_encode([]));
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
    
    public function sendResponse($response = array()) {
        $jsonResponse = $this->resultFactory->create(ResultFactory::TYPE_JSON);
        $jsonResponse->setData($response);
        return $jsonResponse;
    }
}
