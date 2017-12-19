<?php

namespace Develodesign\Designer\Helper;

class Url extends \Magento\Framework\App\Helper\AbstractHelper{
    
    protected $_dataHelper;
    
    protected $_storeManager;
    
    const PRODUCT_ID_VAR_NAME = 'pid';
    
    public function __construct(
        \Magento\Framework\App\Helper\Context $context,
        \Magento\Store\Model\StoreManagerInterface $storeManage,    
        Data $dataHelper
    ) {
        parent::__construct($context);
        $this->_dataHelper   = $dataHelper;
        $this->_storeManager = $storeManage;
    }
    
    public function getProductCustomizeUrl($_product) {
        $router = $this->_dataHelper->getDesignerFrontEndRoute();
        return $this->getBaseUrl() .
                    $router . 
                    '?' . self::PRODUCT_ID_VAR_NAME . '=' . $_product->getId();
    }
    
    protected function getBaseUrl() {
        return $this->_storeManager
                ->getStore()
                ->getBaseUrl();
    }
}
