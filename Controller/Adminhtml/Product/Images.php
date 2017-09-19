<?php

namespace Develo\Designer\Controller\Adminhtml\Product;

use Magento\Framework\Controller\ResultFactory;

class Images extends \Magento\Backend\App\Action {
    
    
    public function __construct(
        \Magento\Backend\App\Action\Context $context
    ) {
        parent::__construct($context);
    }
    
    public function execute() {
        
        return $this->sendResponse([
            'success' => true,
            'data' => []
        ]);
    }
    
    
    public function sendResponse($response = array()) {
        $jsonResponse = $this->resultFactory->create(ResultFactory::TYPE_JSON);
        $jsonResponse->setData($response);
        return $jsonResponse;
    }
}
