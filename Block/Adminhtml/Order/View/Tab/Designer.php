<?php

namespace Develo\Designer\Block\Adminhtml\Order\View\Tab;

class Designer extends \Magento\Sales\Block\Adminhtml\Order\AbstractOrder implements
    \Magento\Backend\Block\Widget\Tab\TabInterface{
    
    protected $_designerOrder;
    
    protected $_designCartItemModel;
    
    protected $_productModel;
    
    public function __construct(
        \Magento\Backend\Block\Template\Context $context, 
        \Magento\Framework\Registry $registry, 
        \Magento\Sales\Helper\Admin $adminHelper,
        \Magento\Catalog\Model\ProductFactory $productModel,    
        \Develo\Designer\Model\OrderFactory $designerOrder,    
        \Develo\Designer\Model\CartitemFactory $designCartItemModel,    
        array $data = array()
    ) {
        parent::__construct($context, $registry, $adminHelper, $data);
        
        $this->_designCartItemModel = $designCartItemModel;
        $this->_designerOrder = $designerOrder;
        $this->_productModel = $productModel;
    }
    
    public function prepareConf($confStr) {
        return $confStr ? json_decode($confStr) : [];
    }
    
    public function getProduct($productId) {
        return $this->_productModel->create()
                ->load($productId);
    }

    public function getDesignerData() {
        $order = $this->getOrder();
        $collection = $this->_designCartItemModel->create()
                ->getCollection();
        
        $collection->getSelect()->where('cart_quote_id=?', $order->getQuoteId());
        return $collection;
    }
    
    /**
     * ######################## TAB settings #################################
     */
    
    public function canShowTab(){
        return true;
    }

    public function getTabLabel(){
        return __('Product Designer');
    }

    public function getTabTitle(){
        return __('Product Designer');
    }

    public function isHidden(){
        return $this->checkIsHidden();
    }
    
    protected function checkIsHidden() {
        $order = $this->getOrder();
        $model = $this->_designerOrder->create()
                ->load($order->getIncrementId(), 'magento_order_id');
        if(!$model->getId()) {
            return true;
        }
    }

}
