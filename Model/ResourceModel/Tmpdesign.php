<?php

namespace Develo\Designer\Model\ResourceModel;

class Tmpdesign extends \Magento\Framework\Model\ResourceModel\Db\AbstractDb {

    
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
        $this->_init('dd_productdesigner_tmp_designs', 'design_id');
    }

    protected function _beforeSave(\Magento\Framework\Model\AbstractModel $object) {
        if(!$object->getUniqueId()) {
            $object->setUniqueId(uniqid());
        }
        return parent::_beforeSave($object);
    }

}
