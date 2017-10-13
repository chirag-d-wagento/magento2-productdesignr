<?php

namespace Develo\Designer\Observer;

use Magento\Framework\Event\Observer;
use Magento\Framework\Event\ObserverInterface;

class AddAfter implements ObserverInterface{
    
    protected $_productRepo;
    protected $_registry;
    
    const CURRENT_REGISTRATED_PRODUCT = 'dd_designer_added_to_cart';
    
    public function __construct(
        \Magento\Catalog\Api\ProductRepositoryInterface $productRepo,
        \Magento\Framework\Registry $registry    
    ) {
        $this->_productRepo = $productRepo;
        $this->_registry = $registry;
    }
    
    public function execute(Observer $observer) {
        $quoteItem = $observer->getQuoteItem();
        $product = $this->_productRepo->get($quoteItem->getProduct()->getSku());
        $this->_registry->register(self::CURRENT_REGISTRATED_PRODUCT, $product);
    }
}
