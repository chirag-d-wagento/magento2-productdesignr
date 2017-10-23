<?php

namespace Develo\Designer\Observer;

use Magento\Framework\Event\Observer;
use Magento\Framework\Event\ObserverInterface;

class RemoveAfter implements ObserverInterface {

    protected $_designCartItemModel;
    
    public function __construct(
       \Develo\Designer\Model\CartitemFactory $designCartItemModel
    ) {
        $this->_designCartItemModel = $designCartItemModel;
    }

    public function execute(Observer $observer) {
        $quoteItem = $observer->getQuoteItem();
        $model = $this->_designCartItemModel->create()
                ->load($quoteItem->getId(), 'cart_item_id');
        
        $model->delete();
    }
    
    

}
