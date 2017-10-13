<?php

namespace Develo\Designer\Controller;

use Magento\Framework\Controller\ResultFactory;

abstract class Front extends \Magento\Framework\App\Action\Action {
    
    
    protected function sendError($errMessage) {
        return $this->sendResponse([
            'error' => true,
            'errMessage' => $errMessage
        ]);
    }
    
    protected function sendResponse($response = array()) {

        $jsonResponse = $this->resultFactory->create(ResultFactory::TYPE_JSON);
        $jsonResponse->setData($response);
        return $jsonResponse;
    }
}
