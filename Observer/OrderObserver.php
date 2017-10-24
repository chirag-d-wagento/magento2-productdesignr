<?php

namespace Develo\Designer\Observer;

use Magento\Framework\Event\Observer;
use Magento\Framework\Event\ObserverInterface;

class OrderObserver implements ObserverInterface {

    protected $_quoteFactory;
    
    protected $_designCartItemModel;
    
    protected $_designOrderModel;

    public function __construct(
        \Magento\Quote\Model\QuoteFactory $quoteFactory,    
        \Develo\Designer\Model\CartitemFactory $designCartItemModel,
        \Develo\Designer\Model\OrderFactory $designOrderModel
    ) {
        $this->_quoteFactory = $quoteFactory;
        $this->_designCartItemModel = $designCartItemModel;
        $this->_designOrderModel = $designOrderModel;
    }

    public function execute(Observer $observer) {
        $order = $observer->getEvent()->getOrder();
        $quoteId = $order->getQuoteId();

        $quote = $this->_quoteFactory->create()
                ->load($quoteId);

        if ($this->isHaveDesignerProducts($quote)) {
            $this->createOrderRecord($order);
        }
    }
    
    protected function createOrderRecord($order) {
        $model = $this->_designOrderModel->create()
                ->load(null);
        
        $model->setMagentoOrderId($order->getId());
        
        $model->save();
    }

    protected function isHaveDesignerProducts($quote) {
        $collection = $this->_designCartItemModel->create()
                ->getCollection();
        
        $collection->getSelect()
                ->where('cart_quote_id=?', $quote->getId());
        
        if($collection->getSize()) {
            return true;
        }
    }

}
