<?php

namespace Develo\Designer\Setup;

use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Setup\ModuleDataSetupInterface;

class UpgradeData implements \Magento\Framework\Setup\UpgradeDataInterface {

    protected $_blockFactory;

    public function __construct(
    \Magento\Cms\Model\BlockFactory $blockFactory
    ) {
        $this->_blockFactory = $blockFactory;
    }

    public function upgrade(ModuleDataSetupInterface $setup, ModuleContextInterface $context) {

        $setup->startSetup();
        if (version_compare($context->getVersion(), '1.0.7') < 0) {
            echo 'Create help customize button cms block' . "\n";
            $this->createCustomizeButtonCmsBlock();
        }
        $setup->endSetup();
    }

    protected function createCustomizeButtonCmsBlock() {
        $testBlock = [
            'title' => 'Designer Help Customize button default',
            'identifier' => 'customize-button-help-default',
            'stores' => [0],
            'is_active' => 1,
            'content' => '<p>Use "<strong>Customize It</strong> button" for create your own custom design</p>',
        ];
        $this->_blockFactory->create()->setData($testBlock)->save();
    }

}
