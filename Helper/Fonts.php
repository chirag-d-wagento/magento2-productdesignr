<?php

namespace Develo\Designer\Helper;

class Fonts extends \Magento\Framework\App\Helper\AbstractHelper {

    protected $_webSaveFonts = [
        'Arial,Arial,Helvetica,sans-serif',
        'Arial Black,Arial Black,Gadget,sans-serif',
        'Comic Sans MS,Comic Sans MS,cursive',
        'Courier New,Courier New,Courier,monospace',
        'Georgia,Georgia,serif',
        'Impact,Charcoal,sans-serif',
        'Lucida Console,Monaco,monospace',
        'Lucida Sans Unicode,Lucida Grande,sans-serif',
        'Palatino Linotype,Book Antiqua,Palatino,serif',
        'Tahoma,Geneva,sans-serif',
        'Times New Roman,Times,serif',
        'Trebuchet MS,Helvetica,sans-serif',
        'Verdana,Geneva,sans-serif',
        'Gill Sans,Geneva,sans-serif'
    ];

    public function getFonts() {
        return $this->_webSaveFonts;
    }

}
