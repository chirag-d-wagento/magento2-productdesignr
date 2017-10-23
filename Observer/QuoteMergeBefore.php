<?php

namespace Develo\Designer\Observer;

use Magento\Framework\Event\Observer;
use Magento\Framework\Event\ObserverInterface;

class QuoteMergeBefore implements ObserverInterface {
    
    const OLD_QUOTE = 'dd_designer_old_quote_id';
    
    protected $_logger;
    
    protected $_registry;
    
    protected $_designCartItemModel;
    
    public function __construct(
        \Psr\Log\LoggerInterface $logger,
        \Magento\Framework\Registry $registry,
        \Develo\Designer\Model\CartitemFactory $designCartItemModel
    ) {
        $this->_logger = $logger;
        $this->_registry = $registry;
        $this->_designCartItemModel = $designCartItemModel;
    }

    public function execute(Observer $observer) {
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
