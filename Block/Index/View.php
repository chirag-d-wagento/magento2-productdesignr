<?php

namespace Develo\Designer\Block\Index;

class View extends \Magento\Framework\View\Element\Template{
    
    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context, 
        array $data = array()
    ) {
        parent::__construct($context, $data);
    }
    
}
