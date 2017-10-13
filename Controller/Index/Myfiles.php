<?php

namespace Develo\Designer\Controller\Index;

class Myfiles extends \Develo\Designer\Controller\Front {

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
        } catch (Exception $ex) {
            return $this->sendError(__('Error') . ': ' . $ex->getMessage());
        }
    }

}
