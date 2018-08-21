<?php

namespace Develodesign\Designer\Model\Config\Source;

use  Magento\Catalog\Model\ResourceModel\Eav\Attribute as eavAttributes;

class ProductAttributes implements \Magento\Framework\Option\ArrayInterface{

    protected $_attributes;
    
    public function __construct(
        eavAttributes $attributes
    ) {
        $this->_attributes = $attributes;
    }
    
    public function toOptionArray()
    {
        $arr = [];
        $arr[] = array('value' => '', 'label' => 'None');

        $attributes = $this->_attributes->getCollection()->addFieldToFilter(\Magento\Eav\Model\Entity\Attribute\Set::KEY_ENTITY_TYPE_ID, 4);

        foreach($attributes as $attribute) {
            if($attribute->getFrontendInput() == 'select') {
                $arr[] = array('value' => $attribute->getAttributeId(), 'label' => $attribute->getFrontendLabel());
            }
        }

        return $arr;
    }
}
