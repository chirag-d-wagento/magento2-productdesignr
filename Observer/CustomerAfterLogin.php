<?php

namespace Develodesign\Designer\Observer;

use Magento\Framework\Event\Observer;
use Magento\Framework\Event\ObserverInterface;

class CustomerAfterLogin implements ObserverInterface {

    protected $_logger;

    protected $_designCartItemModel;
    
    protected $_registry;
    
    protected $_checkoutSession;
    
    protected $_designerHelper;
    
    public function __construct(
        \Psr\Log\LoggerInterface $logger,
        \Magento\Framework\Registry $registry,
        \Magento\Checkout\Model\Session $checkoutSession,    
        \Develodesign\Designer\Helper\Data $designerHelper,     
        \Develodesign\Designer\Model\CartitemFactory $designCartItemModel    
    ) {
        $this->_logger = $logger;
        $this->_registry = $registry;
        $this->_checkoutSession = $checkoutSession;
        $this->_designCartItemModel = $designCartItemModel;
        
        $this->_designerHelper = $designerHelper;
    }

    public function execute(Observer $observer) {
        if(!$this->_designerHelper->getIsDesignerEnabled()) {
            return;
        }
        
        $oldQuoteId = $this->_registry->registry(\Develodesign\Designer\Observer\QuoteMergeBefore::OLD_QUOTE);
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
        
        $this->_registry->unregister(\Develodesign\Designer\Observer\QuoteMergeBefore::OLD_QUOTE);
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
