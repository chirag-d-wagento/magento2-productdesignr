<?php

namespace Develo\Designer\Helper;

class Fonts extends \Magento\Framework\App\Helper\AbstractHelper {

    protected $_saveWebFonts = [
        'Verdana, Geneva, sans-serif'
    ];
    
    protected $_webGoogleFonts = [
        '"Roboto", sans-serif',
        '"Open Sans", sans-serif',
        '"Lato", sans-serif',
        '"Raleway", sans-serif',
        '"Source Sans Pro", sans-serif',
        '"Ubuntu", sans-serif',
        '"Titillium Web", sans-serif',
        '"Poppins", sans-serif',
        '"Dosis", sans-serif',
        '"Nunito", sans-serif',
        '"Work Sans", sans-serif',
        '"Cabin", sans-serif',
        '"Josefin Sans", sans-serif',
        '"Merriweather Sans", sans-serif',
        '"Exo 2", sans-serif',
        '"Source Code Pro", monospace',
        '"Kanit", sans-serif',
        '"Exo", sans-serif',
        '"Rokkitt", serif',
        '"Changa", sans-serif',
        '"Martel", serif',
        '"Alegreya Sans SC", sans-serif',
        '"Arima Madurai", cursive',
        '"Montserrat Alternates", sans-serif',
        '"Martel Sans", sans-serif',
        '"Expletus Sans", cursive',
        '"Inknut Antiqua", serif',
    ];

    public function getFonts() {
        return array_merge($this->_saveWebFonts, $this->_webGoogleFonts);
    }

}
