<?php

namespace Develo\Designer\Model;

use Magento\Framework\DataObject\IdentityInterface;

class Imagegroup extends \Magento\Framework\Model\AbstractModel implements IdentityInterface {

    const CACHE_TAG = 'dd_designer_groupimage_block';

    /**
     * @var string
     */
    protected $_cacheTag = 'dd_designer_groupimage_block';

    const IDENTIFIER = 'dd_designer_groupimage_model_';

    /**
     * @return void
     */
    protected function _construct() {
        $this->_init('Develo\Designer\Model\ResourceModel\Imagegroup');
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
