<?php

namespace Develodesign\Designer\Model\ResourceModel;

/**
 * Post model
 */
class Cartitem extends \Magento\Framework\Model\ResourceModel\Db\AbstractDb {

    /**
     * Initialize resource model
     *
     * @return void
     */
    protected function _construct() {
        $this->_init('dd_productdesigner_cart_items', '_item_id');
    }

    protected function _beforeSave(\Magento\Framework\Model\AbstractModel $object) {
        return parent::_beforeSave($object);
    }

}
