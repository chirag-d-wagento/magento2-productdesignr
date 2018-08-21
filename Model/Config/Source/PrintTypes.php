<?php

namespace Develodesign\Designer\Model\Config\Source;

class PrintTypes implements \Magento\Framework\Option\ArrayInterface{

    public function toOptionArray()
    {
        return array(
            array('value'=>'vinyl','label'=>__('Vinyl')),
            array('value'=>'embroidery','label'=>__('Embroidery'))
        );
    }
}
