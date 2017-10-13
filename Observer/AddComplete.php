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
    
    public function __construct(
        \Magento\Checkout\Model\Cart $cart, 
        \Develo\Designer\Model\TmpdesignFactory $tmpDesignModel, 
        \Develo\Designer\Model\CartitemFactory $cartItem,
        DateTime $date,    
        \Psr\Log\LoggerInterface $logger
    ) {
        $this->_cart = $cart;
        $this->_tmpDesignModel = $tmpDesignModel;
        $this->_cartItem = $cartItem;
        $this->_logger = $logger;
        $this->_date = $date;
    }

    public function execute(Observer $observer) {
        $request = $observer->getRequest();
        $designsIds = $request->getParam('dd_design');
        if (!$designsIds || !is_array($designsIds)) {
            return;
        }

        $product = $observer->getProduct();
        $quoteData = $this->getQuoteData($product);
        if (!empty($quoteData['cart_quote_id'])) {

            $this->removeOldDesigns($quoteData['cart_item_id']);
            foreach($designsIds as $designId) {
                
                $modelCartItem = $this->_cartItem->create()
                        ->load(null); //new one!
                
                $tmpDesign = $this->_tmpDesignModel->create()
                        ->load($designId, 'unique_id');
                
                if(!$tmpDesign->getId()) {
                    $this->logger->critical('Unknow tmp design for product id: ' 
                            . $product->getId() 
                            .  ' add complete!');
                    continue;
                }
                
                $modelCartItem->setCartQuoteId($quoteData['cart_quote_id'])
                        ->setCartItemId($quoteData['cart_item_id'])
                        ->setCreatedTime($this->_date->gmtDate())
                        ->setJsonText($tmpDesign->getJsonText())
                        ->setPngBlob($tmpDesign->getPngBlob())
                        ->setConf($tmpDesign->getConf());
                
                $modelCartItem->save();
                
                $tmpDesign->delete();
            }
            
        } else {
            //error handler
            $this->logger->critical('Unknow quote dd_designer add complete!');
        }
    }

    protected function removeOldDesigns($cartItemId) {
        $collection = $this->_cartItem->create()
                ->getCollection();
        $collection->getSelect()->where('cart_item_id=?', $cartItemId);
        $collection->walk('delete');
    }

    protected function getQuoteData($product) {
        $out = [
        ];
        $cartItems = $this->_cart->getQuote()
                ->getAllVisibleItems();
        if (!$cartItems || !is_array($cartItems)) {
            return;
        }
        foreach ($cartItems as $cartItem) {
            if ($cartItem->getProductId() == $product->getId()) {
                return [
                    'cart_quote_id' => $cartItem->getQuote()->getId(),
                    'cart_item_id' => $cartItem->getId()
                ];
            }
        }

        return $out;
    }

}
