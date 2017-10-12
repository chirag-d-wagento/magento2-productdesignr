<?php

namespace Develo\Designer\Observer;

use Magento\Framework\Event\Observer;
use Magento\Framework\Event\ObserverInterface;

class QuoteMergeAfter implements ObserverInterface {

    public function __construct() {
        ;
    }

    public function execute(Observer $observer) {
        $oldQuote = $observer->getSource();
        $newQuote = $observer->getQuote();
    }

}
