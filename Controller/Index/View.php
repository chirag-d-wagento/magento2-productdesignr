<?php

namespace Develo\Designer\Controller\Index;

class View extends \Magento\Framework\App\Action\Action {

    protected $_resultPageFactory;
    
    public function __construct(
        \Magento\Framework\App\Action\Context $context, 
        \Magento\Framework\View\Result\PageFactory $resultPageFactory 
    ) {
        parent::__construct($context);
        $this->_resultPageFactory = $resultPageFactory;
    }
    
    public function execute() {
        $productId = $this->getRequest()->getParam(\Develo\Designer\Helper\Url::PRODUCT_ID_VAR_NAME, null);
        return $this->_resultPageFactory->create();
    }

}
