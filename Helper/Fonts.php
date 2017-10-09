<?php

namespace Develo\Designer\Helper;

class Fonts extends \Magento\Framework\App\Helper\AbstractHelper {

    protected $_dataHelper;
    
    protected $_saveWebFonts = [
        'Verdana, Geneva, sans-serif'
    ];
    
    public function __construct(
        \Magento\Framework\App\Helper\Context $context,
        \Develo\Designer\Helper\Data $dataHelper    
    ) {
        $this->_dataHelper = $dataHelper;
        parent::__construct($context);
    }

    public function getFonts() {
        $_webGoogleFontsStr = $this->_dataHelper->getGoogleFonts();
        $_webGoogleFonts  = [];
        $_webGoogleFontsArr = explode(',', $_webGoogleFontsStr);
        foreach($_webGoogleFontsArr as $_webGoogleFont) {
            $_webGoogleFonts[] = trim($_webGoogleFont) . ', sans-serif';
        }
        return array_merge($this->_saveWebFonts, $_webGoogleFonts);
    }

}
