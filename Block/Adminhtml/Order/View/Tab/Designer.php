<?php

namespace Develo\Designer\Block\Adminhtml\Order\View\Tab;

class Designer extends \Magento\Sales\Block\Adminhtml\Order\AbstractOrder implements
    \Magento\Backend\Block\Widget\Tab\TabInterface{
    
    
    public function canShowTab(){
        return true;
    }

    public function getTabLabel(){
        return __('Product Designer');
    }

    public function getTabTitle(){
        return __('Product Designer');
    }

    public function isHidden(){
        return false;
    }

}
