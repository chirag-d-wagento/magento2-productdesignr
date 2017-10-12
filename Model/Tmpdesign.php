<?php

namespace Develo\Designer\Model;

use Magento\Framework\DataObject\IdentityInterface;

class Tmpdesign extends \Magento\Framework\Model\AbstractModel implements IdentityInterface {

    const CACHE_TAG = 'dd_designer_tmp_design_block';

    /**
     * @var string
     */
    protected $_cacheTag = 'dd_designer_tmp_design_block';

    const IDENTIFIER = 'dd_designer_tmp_design_model_';

    /**
     * @return void
     */
    protected function _construct() {
        $this->_init('Develo\Designer\Model\ResourceModel\Tmpdesign');
    }

    /**
     * Get identities
     *
     * @return array
     */
    public function getIdentities() {
        return [self::CACHE_TAG . '_' . $this->getId(), self::CACHE_TAG . '_' . $this->getIdentifier()];
    }

}

