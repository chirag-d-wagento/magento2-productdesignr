<?php

namespace Develo\Designer\Observer;

use Magento\Framework\Event\Observer;
use Magento\Framework\Event\ObserverInterface;
use Magento\Framework\Stdlib\DateTime\DateTime;

class AddComplete implements ObserverInterface {

    protected $_cart;
    protected $_tmpDesignModel;
    protected $_cartItem;
    protected $_logger;
    protected $_date;
    protected $_registry;
    protected $_designerHelper;

    public function __construct(
        \Magento\Checkout\Model\Cart $cart, 
        \Develo\Designer\Model\TmpdesignFactory $tmpDesignModel, 
        \Develo\Designer\Model\CartitemFactory $cartItem, 
        \Develo\Designer\Helper\Data $designerHelper,     
        DateTime $date, 
        \Psr\Log\LoggerInterface $logger, 
        \Magento\Framework\Registry $registry
    ) {
        $this->_cart = $cart;
        $this->_tmpDesignModel = $tmpDesignModel;
        $this->_cartItem = $cartItem;
        $this->_logger = $logger;
        $this->_date = $date;
        $this->_registry = $registry;
        
        $this->_designerHelper = $designerHelper;
    }

    public function execute(Observer $observer) {
        if(!$this->_designerHelper->getIsDesignerEnabled()) {
            return;
        }
        
        $request = $observer->getRequest();
        $designsIds = $request->getParam('dd_design');
        $product = $this->_registry->registry(\Develo\Designer\Observer\AddAfter::CURRENT_REGISTRATED_PRODUCT);
        $quoteData = $this->getQuoteData($product);
        if (!empty($quoteData['cart_quote_id'])) {
            $this->removeOldDesigns($quoteData['cart_item_id']);
        }
        if (!$designsIds || !is_array($designsIds)) {
            return;
        }

        $this->run($designsIds, $quoteData);
    }
    
    public function run($designsIds, $quoteData = null) {
        
        if (!empty($quoteData['cart_quote_id'])) {
            
        $product = $this->_registry->registry(\Develo\Designer\Observer\AddAfter::CURRENT_REGISTRATED_PRODUCT);
        
            foreach ($designsIds as $designId) {
                $modelCartItem = $this->_cartItem->create()
                        ->load(null); //new one!

                $tmpDesign = $this->_tmpDesignModel->create()
                        ->load($designId, 'unique_id');

                if (!$tmpDesign->getId()) {
                    $this->_logger->critical('Unknow tmp design for product id: '
                            . $product->getId()
                            . ' add complete!');
                    continue;
                }

                $modelCartItem->setCartQuoteId($quoteData['cart_quote_id'])
                        ->setCartItemId($quoteData['cart_item_id'])
                        ->setCreatedTime($this->_date->gmtDate())
                        ->setJsonText($tmpDesign->getJsonText())
                        ->setPngBlob($tmpDesign->getPngBlob())
                        ->setMagentoProductId($product->getId())
                        ->setConf($tmpDesign->getConf());

                $modelCartItem->save();

                $tmpDesign->delete();
            }
        } else {
            //error handler
            $this->_logger->critical('Unknow quote dd_designer add complete!');
        }
    }

    protected function removeOldDesigns($cartItemId) {
        $collection = $this->_cartItem->create()
                ->getCollection();
        $collection->getSelect()->where('cart_item_id=?', $cartItemId);
        $collection->walk('delete');
    }

    protected function getQuoteData($product, $quoteItemId = null) {
        $out = [
        ];
        $productId = $product->getId();
        $cartItems = $this->_cart->getQuote()
                ->getAllItems();
        if (!$cartItems || !is_array($cartItems)) {
            return;
        }
        foreach ($cartItems as $cartItem) {
            if ($cartItem->getProductId() == $productId) {
                if(!$cartItem->getParentItemId()) {
                    return [
                        'cart_quote_id' => $cartItem->getQuote()->getId(),
                        'cart_item_id' => $cartItem->getId()
                    ];
                }
                return $this->getQuoteData($product, $cartItem->getParentItemId());
            }
            if($quoteItemId !== null && $quoteItemId == $cartItem->getId()) {
                return [
                        'cart_quote_id' => $cartItem->getQuote()->getId(),
                        'cart_item_id' => $cartItem->getId()
                    ];
            }
        }

        return $out;
    }

}
