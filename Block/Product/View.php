<?php

namespace Develo\Designer\Block\Product;

class View extends \Magento\Catalog\Block\Product\AbstractProduct {

    protected $_designerHelper;
    
    public function __construct(
        \Magento\Catalog\Block\Product\Context $context, 
        \Develo\Designer\Helper\Data $designerHelper,    
        array $data = array()
    ) {
        parent::__construct($context, $data);
        
        $this->_designerHelper = $designerHelper;
    }
    
    public function showCustomizeButton() {
        $product = $this->getProduct();
        return $this->_designerHelper->getIsActiveOnProductView($product);
    }
}
