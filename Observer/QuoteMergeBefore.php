<?php

namespace Develodesign\Designer\Observer;

use Magento\Framework\Event\Observer;
use Magento\Framework\Event\ObserverInterface;

class QuoteMergeBefore implements ObserverInterface {
    
    const OLD_QUOTE = 'dd_designer_old_quote_id';
    
    protected $_logger;
    
    protected $_registry;
    
    protected $_designCartItemModel;
    
    protected $_designerHelper;
    
    public function __construct(
        \Psr\Log\LoggerInterface $logger,
        \Magento\Framework\Registry $registry,
        \Develodesign\Designer\Helper\Data $designerHelper,     
        \Develodesign\Designer\Model\CartitemFactory $designCartItemModel
    ) {
        $this->_logger = $logger;
        $this->_registry = $registry;
        $this->_designCartItemModel = $designCartItemModel;
        
        $this->_designerHelper = $designerHelper;
    }

    public function execute(Observer $observer) {
        if(!$this->_designerHelper->getIsDesignerEnabled()) {
            return;
        }
        
        $oldQuote = $observer->getSource();
        if(!$this->checkIsQuoteRecordExists($oldQuote->getId())) {
            return;
        }
        
        $this->_registry->register(self::OLD_QUOTE, $oldQuote->getId());
    }
    
    protected function checkIsQuoteRecordExists($oldQuoteId) {
        $collection = $this->_designCartItemModel->create()
                ->getCollection();
        $collection->getSelect()
                ->where('cart_quote_id=?', $oldQuoteId);
        if($collection->getSize()) {
            return true;
        }
    }

}
