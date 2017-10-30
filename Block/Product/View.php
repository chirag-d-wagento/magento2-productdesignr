<?php

namespace Develo\Designer\Block\Product;

class View extends \Magento\Catalog\Block\Product\AbstractProduct {

    protected $_designerHelper;
    
    protected $_helperUrl;
    
    protected $_designerModel;
    
    protected $_designerFonts;
    
    public function __construct(
        \Magento\Catalog\Block\Product\Context $context, 
        \Develo\Designer\Helper\Data $designerHelper,    
        \Develo\Designer\Helper\Url $helperUrl,
        \Develo\Designer\Helper\Fonts $designerFonts,    

        \Develo\Designer\Model\Designer $designerModel,
        array $data = array()
    ) {
        parent::__construct($context, $data);
        
        $this->_designerHelper = $designerHelper;
        $this->_helperUrl = $helperUrl;
        $this->_designerModel = $designerModel;
        $this->_designerFonts = $designerFonts;
    }
    
    public function showCustomizeButton() {
        $product = $this->getProduct();
        return $this->_designerHelper->getIsActiveOnProductView($product);
    }
    
    public function getCustomizeUrl() {
        $product = $this->getProduct();
        return $this->_helperUrl->getProductSustomizeUrl($product);
    }
    
    public function getDesignerConfiguration($product) {
        return json_encode($this->_designerModel->loadFrontConfiguration($product));
    }
    
    public function getFonts()  {
        return $this->_designerFonts->getFonts();
    }
    
    public function getUploadFileUrl() {
        return $this->getUrl('dd_designer/index/upload');
    }
    
    public function getMyFilesUrl() {
        return $this->getUrl('dd_designer/index/myfiles');
    }
    
    public function getSaveDesignUrl() {
        return $this->getUrl('dd_designer/index/save');
    }
    
    public function getLibraryUrl() {
        return $this->getUrl('dd_designer/index/library');
    }
}
