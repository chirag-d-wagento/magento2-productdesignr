<?php

namespace Develo\Designer\Helper;

class Data extends \Magento\Framework\App\Helper\AbstractHelper {

    const DESIGNER_GENERAL_ENABLED = 'develo_productdesigner/general/enable';
    const DESIGNER_GENERAL_FRONT_ROUTE = 'develo_productdesigner/general/product_designer_route';
    
    const DESIGNER_FRONT_ENABLE_FOR_ALL = 'develo_productdesigner/frontend/enable_all';
    const DESIGNER_FRONT_PRODUCT_ATTR_SETS = 'develo_productdesigner/frontend/attributes_sets';
    const DESIGNER_FRONT_PRODUCT_LAYER_POSITION = 'develo_productdesigner/frontend/layer_position';
    
    const DESIGNER_FRONT_PRODUCT_GOOGLE_FONTS = 'develo_productdesigner/frontend/google_fonts';

    public function __construct(\Magento\Framework\App\Helper\Context $context) {
        parent::__construct($context);
    }

    public function getIsDesignerEnabled() {
        return $this->scopeConfig->getValue(self::DESIGNER_GENERAL_ENABLED, \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
    }

    public function getDesignerFrontEndRoute() {
        return $this->scopeConfig->getValue(self::DESIGNER_GENERAL_FRONT_ROUTE, \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
    }
    
    public function getIsEnabledForAllProducts() {
        return $this->scopeConfig->getValue(self::DESIGNER_FRONT_ENABLE_FOR_ALL, \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
    }
    
    public function getProductsAttributesSets() {
        return $this->scopeConfig->getValue(self::DESIGNER_FRONT_PRODUCT_ATTR_SETS, \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
    }
    
    public function getGoogleFonts() {
        return $this->scopeConfig->getValue(self::DESIGNER_FRONT_PRODUCT_GOOGLE_FONTS, \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
    }
    
    
    public function getProductsAttributesSetsArray() {
        $attributeSets = $this->getProductsAttributesSets();
        
        if($attributeSets) {
            return explode(',', $attributeSets);
        }
        return array();
    }
    
    public function getFrontDefaultLayerPosition() {
        return $this->scopeConfig->getValue(self::DESIGNER_FRONT_PRODUCT_LAYER_POSITION, \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
    }
    
    public function getIsActiveOnProductView($product) {
        if(!$this->getIsDesignerEnabled()) {
            return false;
        }
        if($this->getIsEnabledForAllProducts()) {
            return true;
        }
        $attributesSets = $this->getProductsAttributesSetsArray();
        if($attributesSets && in_array($product->getAttributeSetId(), $attributesSets)) {
            return true;
        }
        
    }
    
    

}
