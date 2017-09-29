<?php

namespace Develo\Designer\Controller\Adminhtml\Group;

class Save extends \Magento\Backend\App\Action {
    
    protected $_productLoader;
    protected $_groupModel;
    protected $_imageModel;
    
    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Magento\Catalog\Model\ProductFactory $productLoader
    ) {
        parent::__construct($context);
        $this->_productLoader = $productLoader;
    }
    
    
}
