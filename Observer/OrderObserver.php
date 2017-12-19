<?php

namespace Develodesign\Designer\Observer;

use Magento\Framework\Event\Observer;
use Magento\Framework\Event\ObserverInterface;

class OrderObserver implements ObserverInterface {

    protected $_logger;
    
    protected $_designCartItemModel;
    
    protected $_designOrderModel;
    
    protected $_designerHelper;

    public function __construct(
        \Psr\Log\LoggerInterface $logger,
        \Develodesign\Designer\Model\CartitemFactory $designCartItemModel,
        \Develodesign\Designer\Helper\Data $designerHelper,      
        \Develodesign\Designer\Model\OrderFactory $designOrderModel
    ) {
        $this->_logger = $logger;
        $this->_designCartItemModel = $designCartItemModel;
        $this->_designOrderModel = $designOrderModel;
        
        $this->_designerHelper = $designerHelper;
    }

    public function execute(Observer $observer) {
        if(!$this->_designerHelper->getIsDesignerEnabled()) {
            return;
        }
        
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
