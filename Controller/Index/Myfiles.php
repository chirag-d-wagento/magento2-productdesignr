<?php

namespace Develo\Designer\Controller\Index;

use Magento\Framework\Controller\ResultFactory;

class Myfiles extends \Magento\Framework\App\Action\Action {

    protected $_cataloSession;

    public function __construct(
        \Magento\Framework\App\Action\Context $context,
        \Magento\Catalog\Model\Session $catalogSession    
    ) {
        parent::__construct($context);
        
        $this->_catalogSession = $catalogSession;
    }
    
    public function execute() {
        
        $myFiles = $this->_catalogSession->getDDDesignerFiles();
        if (!$myFiles) {
            $myFilesArr = [];
        } else {
            $myFilesArr = json_decode($myFiles);
        }
        
        $jsonResponse = $this->resultFactory->create(ResultFactory::TYPE_JSON);
        $jsonResponse->setData($myFilesArr);
        return $jsonResponse;
    }
}
