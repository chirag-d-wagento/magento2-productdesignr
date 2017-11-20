<?php

namespace Develo\Designer\Block\Product;

class View extends \Magento\Catalog\Block\Product\AbstractProduct {

    protected $_designerHelper;
    protected $_helperUrl;
    protected $_designerModel;
    protected $_designerFonts;
    protected $_pricesLayers = [];
    protected $_storeManager;
    protected $_currency;
    
    protected $_filterProvider;
    protected $_blockFactory;

    public function __construct(
        \Magento\Catalog\Block\Product\Context $context, 
        \Develo\Designer\Helper\Data $designerHelper, 
        \Develo\Designer\Helper\Url $helperUrl, 
        \Develo\Designer\Helper\Fonts $designerFonts, 
        \Magento\Store\Model\StoreManagerInterface $storeManager, 
        \Magento\Directory\Model\Currency $currency, 
        \Develo\Designer\Model\Designer $designerModel, 
        \Magento\Cms\Model\BlockFactory $blockFactory,
        \Magento\Cms\Model\Template\FilterProvider $filterProvider,    
        array $data = array()
    ) {
        parent::__construct($context, $data);

        $this->_designerHelper = $designerHelper;
        $this->_helperUrl = $helperUrl;
        $this->_designerModel = $designerModel;
        $this->_designerFonts = $designerFonts;
        $this->_currency = $currency;
        $this->_storeManager = $storeManager;
        
        $this->_filterProvider = $filterProvider;
        $this->_blockFactory = $blockFactory;
    }

    public function showCustomizeButton() {
        $product = $this->getProduct();
        return $this->_designerHelper->getIsActiveOnProductView($product);
    }

    public function getCustomizeUrl() {
        $product = $this->getProduct();
        return $this->_helperUrl->getProductCustomizeUrl($product);
    }

    public function getDesignerConfiguration($product) {
        $config = $this->_designerModel->loadFrontConfiguration($product);
        $this->setLayerPrices($config);
        return json_encode($this->_designerModel->loadFrontConfiguration($product));
    }

    public function getFonts() {
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

    public function getIsAddImageEnabled() {
        return $this->_designerHelper->getIsAddImageEnabled();
    }

    public function getIsAddTextEnabled() {
        return $this->_designerHelper->getIsAddTextEnabled();
    }

    public function getIsAddFromLibraryEnabled() {
        return $this->_designerHelper->getIsAddFromLibraryEnabled();
    }

    public function getLayerPrices() {
        return json_encode($this->_pricesLayers);
    }
    
    public function getCustomizeButtonHelpText() {
        $html = '';
        $blockId = $this->_designerHelper->getHelpCustomizeButton();
        if($blockId) {
            $storeId = $this->_storeManager->getStore()->getId();
            /** @var \Magento\Cms\Model\Block $block */
            $block = $this->_blockFactory->create();
            $block->setStoreId($storeId)->load($blockId);
            $html = $this->_filterProvider
                    ->getBlockFilter()
                    ->setStoreId($storeId)
                    ->filter($block->getContent());
        }
        
        return $html;
    }

    protected function setLayerPrices($config) {

        if (empty($config[0]) || empty($config[0]['imgs'])) {
            return;
        }

        foreach ($config as $conf) {

            $imgs = $conf['imgs'];

            foreach ($imgs as $img) {
                if (empty($img['media_id'])) {
                    continue;
                }
                $this->_pricesLayers[$img['media_id']]['layer_img_price'] = $this->convertPrice($this->getLayerImgPrice($img));
                $this->_pricesLayers[$img['media_id']]['layer_txt_price'] = $this->convertPrice($this->getLayerTxtPrice($img));
                $this->_pricesLayers[$img['media_id']]['currency'] = $this->getCurrencyCode();
            }
        }
    }

    protected function getLayerImgPrice($conf) {
        $extraConf = $this->getExtraConf($conf);
        if (key_exists('layer_img_price', $extraConf)) {
            return $extraConf['layer_img_price'];
        }
        return $this->_designerHelper->getLayerImgPrice();
    }

    protected function getLayerTxtPrice($conf) {
        $extraConf = $this->getExtraConf($conf);
        if (key_exists('layer_txt_price', $extraConf)) {
            return $extraConf['layer_txt_price'];
        }
        return $this->_designerHelper->getLayerTextPrice();
    }

    protected function getExtraConf($conf) {
        return !empty($conf['extra_config']) ? $conf['extra_config'] : [];
    }

    protected function getCurrencyCode() {
        return $this->_currency->getCurrencySymbol();
    }

    protected function convertPrice($basePrice) {
        $rate = $this->_storeManager->getStore()->getCurrentCurrencyRate();
        return $rate * $basePrice;
    }

}
