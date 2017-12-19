<?php

namespace Develodesign\Designer\Controller\Index;

use Magento\Framework\Controller\ResultFactory;

class Myfiles extends \Magento\Framework\App\Action\Action{

    protected $_cataloSession;

    public function __construct(
        \Magento\Framework\App\Action\Context $context, 
        \Magento\Catalog\Model\Session $catalogSession
    ) {
        parent::__construct($context);
        $this->_catalogSession = $catalogSession;
    }

    public function execute() {
        try {
            $myFiles = $this->_catalogSession->getDDDesignerFiles();
            if (!$myFiles) {
                $myFilesArr = [];
            } else {
                $myFilesArr = json_decode($myFiles);
            }
            return $this->sendResponse($myFilesArr);
        } catch (\Exception $ex) {
            return $this->sendError(__('Error') . ': ' . $ex->getMessage());
        }
    }
    
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
