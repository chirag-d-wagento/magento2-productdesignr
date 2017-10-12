<?php

namespace Develo\Designer\Observer;

use Magento\Framework\Event\Observer;
use Magento\Framework\Event\ObserverInterface;

class RemoveAfter implements ObserverInterface {

    public function __construct() {
        ;
    }

    public function execute(Observer $observer) {
        $quoteItem = $observer->getQuoteItem();
    }

}
