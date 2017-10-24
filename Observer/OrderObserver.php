<?php

namespace Develo\Designer\Observer;

use Magento\Framework\Event\Observer;
use Magento\Framework\Event\ObserverInterface;

class OrderObserver implements ObserverInterface {

    protected $_logger;
    
    protected $_designCartItemModel;
    
    protected $_designOrderModel;

    public function __construct(
        \Psr\Log\LoggerInterface $logger,
        \Develo\Designer\Model\CartitemFactory $designCartItemModel,
        \Develo\Designer\Model\OrderFactory $designOrderModel
    ) {
        $this->_logger = $logger;
        $this->_designCartItemModel = $designCartItemModel;
        $this->_designOrderModel = $designOrderModel;
    }

    public function execute(Observer $observer) {
        $order = $observer->getEvent()->getOrder();
        if ($this->isHaveDesignerProducts($order->getQuoteId())) {
            $this->createOrderRecord($order);
        }
    }
    
    protected function createOrderRecord($order) {
        $model = $this->_designOrderModel->create()
                ->load(null);
        
        $model->setMagentoOrderId($order->getIncrementId());
        
        $model->save();
    }

    protected function isHaveDesignerProducts($quoteId) {
        $collection = $this->_designCartItemModel->create()
                ->getCollection();
        
        $collection->getSelect()
                ->where('cart_quote_id=?', $quoteId);
        
        if($collection->getSize()) {
            return true;
        }
    }

}
