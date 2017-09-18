<?php

namespace Develo\Designer\Helper;

class Url extends \Magento\Framework\App\Helper\AbstractHelper{
    
    protected $_dataHelper;
    
    public function __construct(
        \Magento\Framework\App\Helper\Context $context,
        Data $dataHelper
    ) {
        parent::__construct($context);
        $this->_dataHelper = $dataHelper;
    }
}
