<?php

namespace Develo\Designer\Model\ResourceModel\Image;

class Collection extends \Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection {

    /**
     * @var string
     */
    protected $_idFieldName = 'group_id';

    /**
     * Define resource model
     *
     * @return void
     */
    protected function _construct() {
        $this->_init('Develo\Designer\Model\Image', 'Develo\Designer\Model\ResourceModel\Image');
        /* $this->_map['fields']['store'] = 'store_table.store_id'; */
    }

    protected function _beforeLoad() {
        parent::_beforeLoad();
    }

}
