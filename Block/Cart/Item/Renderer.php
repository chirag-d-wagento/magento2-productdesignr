<?php

namespace Develo\Designer\Block\Cart\Item;
use Magento\Checkout\Block\Cart\Item\Renderer\Actions\Generic;


class Renderer extends Generic
{
    
    protected $_modelCartItem;
    
    protected $_collection;
    
    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context, 
        \Develo\Designer\Model\CartitemFactory $modelCartItem,
        array $data = array()
    ) {
        parent::__construct($context, $data);
        $this->_modelCartItem = $modelCartItem;
    }
    
    public function hasConfigurableDesigns() {
        $quoteItemId = $this->getItem()->getId();
        $this->_collection = $this->_modelCartItem->create()
                ->getCollection();
        
        $this->_collection->getSelect()
                ->where('cart_item_id=?', $quoteItemId);
        
        if($this->_collection->getSize()) {
            return true;
        }
    }
    
    public function getCollection() {
        return $this->_collection;
    }
    
    protected function getImgSrc($imgBlob) {
        
    }
}
