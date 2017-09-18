<?php

namespace Develo\Designer\Block\Product;

class View extends \Magento\Catalog\Block\Product\AbstractProduct {

    protected $_designerHelper;
    
    protected $_helperUrl;
    
    public function __construct(
        \Magento\Catalog\Block\Product\Context $context, 
        \Develo\Designer\Helper\Data $designerHelper,    
        \Develo\Designer\Helper\Url $helperUrl,   
        array $data = array()
    ) {
        parent::__construct($context, $data);
        
        $this->_designerHelper = $designerHelper;
        $this->_helperUrl = $helperUrl;
    }
    
    public function showCustomizeButton() {
        $product = $this->getProduct();
        return $this->_designerHelper->getIsActiveOnProductView($product);
    }
    
    public function getCustomizeUrl() {
        $product = $this->getProduct();
        return $this->_helperUrl->getProductSustomizeUrl($product);
    }
}
