<?php

namespace Develo\Designer\Model\Config\Source;

class ProductAttributesSet implements \Magento\Framework\Option\ArrayInterface{

    protected $_attributesOptions;
    
    public function __construct(
        \Magento\Catalog\Model\Product\AttributeSet\Options $attributesOptions
    ) {
        $this->_attributesOptions = $attributesOptions;
    }
    
    public function toOptionArray()
    {
        return $this->_attributesOptions->toOptionArray();
    }
}
