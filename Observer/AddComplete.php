<?php

namespace Develo\Designer\Observer;

use Magento\Framework\Event\Observer;
use Magento\Framework\Event\ObserverInterface;

class AddComplete implements ObserverInterface {

    public function __construct() {
        ;
    }

    public function execute(Observer $observer) {
        $cartItems = $this->_cart->getQuote()
                ->getAllVisibleItems();
    }

}
