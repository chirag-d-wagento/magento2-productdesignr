<?php

namespace Develodesign\Designer\Model\ResourceModel\Tmpdesign;

class Collection extends \Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection {

    /**
     * @var string
     */
    protected $_idFieldName = 'design_id';

    /**
     * Define resource model
     *
     * @return void
     */
    protected function _construct() {
        $this->_init('Develodesign\Designer\Model\Tmpdesign', 'Develodesign\Designer\Model\ResourceModel\Tmpdesign');
        /* $this->_map['fields']['store'] = 'store_table.store_id'; */
    }

    protected function _beforeLoad() {
        parent::_beforeLoad();
    }

}
