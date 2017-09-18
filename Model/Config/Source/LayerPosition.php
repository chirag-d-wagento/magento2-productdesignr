<?php

namespace Develo\Designer\Model\Config\Source;

class LayerPosition implements \Magento\Framework\Option\ArrayInterface{    
    
    const POSITION_TOP_LEFT   = 'top_left';
    const POSITION_TOP_RIGHT  = 'top_right';
    const POSITION_TOP_CENTER   = 'top_center';
    const POSITION_CENTER_LEFT    = 'center_left';
    const POSITION_CENTER_CENTER  = 'center_center';
    const POSITION_CENTER_RIGHT   = 'center_right';
    const POSITION_BOTTOM_LEFT   = 'bottom_left';
    const POSITION_BOTTOM_CENTER   = 'bottom_center';
    const POSITION_BOTTOM_RIGHT   = 'bottom_right';
    
    public function toOptionArray() {
        return [
            self::POSITION_TOP_LEFT => __('Top Left'),
            self::POSITION_TOP_RIGHT => __('Top Right'),
            self::POSITION_TOP_CENTER => __('Top Center'),
            self::POSITION_CENTER_LEFT => __('Center Left'),
            self::POSITION_CENTER_CENTER => __('Center Center'),
            self::POSITION_CENTER_RIGHT => __('Center Right'),
            self::POSITION_BOTTOM_LEFT => __('Bottom Left'),
            self::POSITION_BOTTOM_CENTER => __('Bottom Center'),
            self::POSITION_BOTTOM_RIGHT => __('Bottom Right'),
        ];
    }
    
}
