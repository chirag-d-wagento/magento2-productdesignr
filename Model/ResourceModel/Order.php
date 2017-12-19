<?php

namespace Develodesign\Designer\Model\ResourceModel;

class Order extends \Magento\Framework\Model\ResourceModel\Db\AbstractDb {

    
    public function __construct(
        \Magento\Framework\Model\ResourceModel\Db\Context $context, 
        $connectionName = null
    ) {
        parent::__construct($context, $connectionName);
    }
    /**
     * Initialize resource model
     *
     * @return void
     */
    protected function _construct() {
        $this->_init('dd_productdesigner_order', 'item_id');
    }

    protected function _beforeSave(\Magento\Framework\Model\AbstractModel $object) {
        return parent::_beforeSave($object);
    }

}

