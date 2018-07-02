<?php

namespace Develodesign\Designer\Observer;

use Magento\Framework\Event\Observer;
use Magento\Framework\Event\ObserverInterface;

class AddAfter implements ObserverInterface {

    protected $_productRepo;
    protected $_registry;
    protected $_tmpDesignModel;
    protected $_designerImage;
    protected $_storeManager;
    protected $_designerHelper;
    protected $_currency;
    protected $_imageDesign;
    protected $_request;

    const CURRENT_REGISTRATED_PRODUCT = 'dd_designer_added_to_cart';

    public function __construct(
        \Magento\Catalog\Api\ProductRepositoryInterface $productRepo, 
        \Develodesign\Designer\Helper\Data $designerHelper, 
        \Develodesign\Designer\Model\TmpdesignFactory $tmpDesignModel, 
        \Develodesign\Designer\Model\ImageFactory $imageDesign, 
        \Magento\Store\Model\StoreManagerInterface $storeManager, 
        \Magento\Directory\Model\Currency $currency,
        \Magento\Framework\App\RequestInterface $request,    
        \Magento\Framework\Registry $registry
    ) {
        $this->_productRepo = $productRepo;
        $this->_registry = $registry;
        $this->_designerHelper = $designerHelper;

        $this->_tmpDesignModel = $tmpDesignModel;
        $this->_currency = $currency;
        $this->_storeManager = $storeManager;
        $this->_imageDesign = $imageDesign;
        $this->_request = $request;
    }

    public function execute(Observer $observer) {
        if(!$this->_designerHelper->getIsDesignerEnabled()) {
            return;
        }
        
        $quoteItem = $observer->getQuoteItem();
        $product = $this->_productRepo->get($quoteItem->getProduct()->getSku());
        $this->_registry->register(self::CURRENT_REGISTRATED_PRODUCT, $product);

        $this->updatePrice($observer);
    }

    protected function updatePrice($observer) {
        $designsIds = $this->_request->getParam('dd_design');

        if (empty($designsIds) || !is_array($designsIds)) {
            return;
        }

        $priceUpdate = 0;

        foreach ($designsIds as $designsId) {
            $tmpDesign = $this->_tmpDesignModel->create()
                    ->load($designsId, 'unique_id');

            if (!$tmpDesign->getId()) {
                continue;
            }
            
            $conf = json_decode($tmpDesign->getConf());
            $mediaId = $tmpDesign->getMediaId();
            $priceUpdate += $this->getPriceByConf($conf, $mediaId);
            
        }
        if ($priceUpdate > 0) {
            $this->changeItemQuotePrice($observer, $priceUpdate);
        }
    }
    
    protected function getPriceByConf($conf, $mediaId) {
        $price = 0;
        $extraConf = $this->loadImageExtraConfiguration($mediaId);
        foreach($conf as $_obj) {
            if($_obj->type === 'image' || !empty($_obj->isSvg)) {
                $price += $this->getLayerImgPrice($extraConf);
            }
            if($_obj->type === 'text' || $_obj->type === 'i-text') {
                $price += $this->getLayerTxtPrice($extraConf);
            }
        }
        
        return $price;
    }
    
    protected function loadImageExtraConfiguration($mediaId) {
        $model = $this->_imageDesign->create()
                ->load($mediaId, 'media_id');
        
        $extraConfigStr = $model->getExtraConfig(); 
        return ($extraConfigStr ? json_decode($extraConfigStr) : []);
    }

    protected function changeItemQuotePrice($observer, $changePrice) {
        
        $item = $observer->getEvent()->getData('quote_item');
        $item = ( $item->getParentItem() ? $item->getParentItem() : $item );
        
        $price = $item->getProduct()->getFinalPrice() + $changePrice; 
        $item->setCustomPrice($price);
        $item->setOriginalCustomPrice($price);
        $item->getProduct()->setIsSuperMode(true);
        
    }

    protected function convertPrice($basePrice = null) {
        if (is_null($basePrice)) {
            return 0;
        }
        $rate = $this->_storeManager->getStore()->getCurrentCurrencyRate();
        return $rate * $basePrice;
    }

    protected function getLayerImgPrice($extraConf = []) {
        if (key_exists('layer_img_price', $extraConf)) {
            return $this->convertPrice($extraConf->layer_img_price);
        }
        return $this->convertPrice($this->_designerHelper->getLayerImgPrice());
    }

    protected function getLayerTxtPrice($extraConf = []) {
        if (key_exists('layer_txt_price', $extraConf)) {
            return $this->convertPrice($extraConf->layer_txt_price);
        }
        return $this->convertPrice($this->_designerHelper->getLayerTextPrice());
    }

    protected function getCurrencyCode() {
        return $this->_currency->getCurrencySymbol();
    }

}
