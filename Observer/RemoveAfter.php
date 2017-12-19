<?php

namespace Develodesign\Designer\Observer;

use Magento\Framework\Event\Observer;
use Magento\Framework\Event\ObserverInterface;

class RemoveAfter implements ObserverInterface {

    protected $_designCartItemModel;
    
    protected $_designerHelper;
    
    public function __construct(
       \Develodesign\Designer\Helper\Data $designerHelper,     
       \Develodesign\Designer\Model\CartitemFactory $designCartItemModel
    ) {
        $this->_designerHelper = $designerHelper;
        $this->_designCartItemModel = $designCartItemModel;
    }

    public function execute(Observer $observer) {
        if(!$this->_designerHelper->getIsDesignerEnabled()) {
            return;
        }
        
        $quoteItem = $observer->getQuoteItem();
        $model = $this->_designCartItemModel->create()
                ->load($quoteItem->getId(), 'cart_item_id');
        
        $model->delete();
    }
    
    

}
