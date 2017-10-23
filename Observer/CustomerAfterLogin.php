<?php

namespace Develo\Designer\Observer;

use Magento\Framework\Event\Observer;
use Magento\Framework\Event\ObserverInterface;

class CustomerAfterLogin implements ObserverInterface {

    protected $_logger;

    protected $_designCartItemModel;
    
    protected $_registry;
    
    protected $_checkoutSession;
    
    public function __construct(
        \Psr\Log\LoggerInterface $logger,
        \Magento\Framework\Registry $registry,
        \Magento\Checkout\Model\Session $checkoutSession,    
        \Develo\Designer\Model\CartitemFactory $designCartItemModel    
    ) {
        $this->_logger = $logger;
        $this->_registry = $registry;
        $this->_checkoutSession = $checkoutSession;
        $this->_designCartItemModel = $designCartItemModel;
    }

    public function execute(Observer $observer) {
        $oldQuoteId = $this->_registry->registry(\Develo\Designer\Observer\QuoteMergeBefore::OLD_QUOTE);
        if(!$oldQuoteId) {
            return;
        }
        
        $quote = $this->_checkoutSession->getQuote();
        
        $cartItems = $quote->getAllItems();
        if(!$cartItems || !is_array($cartItems)){
            return;
        }
        foreach($cartItems as $cartItem){
            if(!$cartItem->getItemId()) {
                return;
            }
        }
        
        foreach($cartItems as $cartItem){
            $updateDesignId = $this->getDesignItemToUpdateId($oldQuoteId, $cartItem->getProductId());
            if(!$updateDesignId){
                continue;
            }
            if($cartItem->getParentItemId()) {
                $cartItemId = $cartItem->getParentItemId();
            }else{
                $cartItemId =  $cartItem->getItemId();
            }
            $this->updateNewQuoteItem($updateDesignId, $quote->getId(), $cartItemId);
        }
        
        $this->_registry->unregister(\Develo\Designer\Observer\QuoteMergeBefore::OLD_QUOTE);
    }
    
    protected function updateNewQuoteItem($updateDesignId, $quoteId, $quoteItemId) {
        $model = $this->_designCartItemModel->create()
                ->load($updateDesignId);
        
        $oldCartQuoteId = $model->getCartQuoteId();
        $oldCartItemId = $model->getCartItemId();
        
        $model->setCartItemId($quoteItemId)
              ->setCartQuoteId($quoteId)
              ->setOldCartQuoteId($oldCartQuoteId)
              ->setOldCartItemId($oldCartItemId);
        
        $model->save();
    }
    
    protected function getDesignItemToUpdateId($oldQuoteId, $productId) {
        $collection = $this->_designCartItemModel->create()
                ->getCollection();
        
        $collection->getSelect()
                ->where('cart_quote_id=?', $oldQuoteId)
                ->where('magento_product_id=?', $productId);
        
        if($collection->getSize()) {
            return $collection->getFirstItem()->getId(); 
        }
    }

}
