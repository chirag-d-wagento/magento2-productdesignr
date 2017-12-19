<?php

namespace Develodesign\Designer\Model\ResourceModel\Imagegroup;

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
        $this->_init('Develodesign\Designer\Model\Imagegroup', 'Develodesign\Designer\Model\ResourceModel\Imagegroup');
        /* $this->_map['fields']['store'] = 'store_table.store_id'; */
    }

    protected function _beforeLoad() {
        parent::_beforeLoad();
    }

}
