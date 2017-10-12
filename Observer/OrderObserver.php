<?php

namespace Develo\Designer\Observer;

use Magento\Framework\Event\Observer;
use Magento\Framework\Event\ObserverInterface;

class OrderObserver implements ObserverInterface {

    public function __construct() {
        ;
    }

    public function execute(Observer $observer) {
        $order = $observer->getEvent()->getOrder();
    }

}
