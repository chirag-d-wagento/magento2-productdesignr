<?php

namespace Develo\Designer\Setup;

use Magento\Framework\Setup\UpgradeSchemaInterface;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Setup\SchemaSetupInterface;

use Magento\Eav\Setup\EavSetup;
use Magento\Eav\Setup\EavSetupFactory;
use Magento\Framework\Setup\ModuleDataSetupInterface;


/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class UpgradeSchema implements UpgradeSchemaInterface
{
    public function __construct(
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig,
        EavSetupFactory $eavSetupFactory    
    ) {
        $this->_storeManager = $storeManager;
        $this->_scopeConfig = $scopeConfig;
        $this->eavSetupFactory = $eavSetupFactory;
    }
    
    public function upgrade(SchemaSetupInterface $setup, ModuleContextInterface $context){
        
        $setup->startSetup();
        if (version_compare($context->getVersion(), '1.0.1') < 0){
            echo 'Add unque_id and image_src fields' . "\n";
            $this->initFieldGroupUid($setup);
            $this->initFieldImageSrc($setup);
            
        }

    }    
    
    protected function initFieldGroupUid($setup){
        $setup->getConnection()->addColumn(
            $setup->getTable('dd_productdesigner_image_groups'),
            'group_uid',
            [
                'type' => \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
                'nullable' => true,
                'comment' => 'Group unique ID'
            ]
        );
    }
    
    protected function initFieldImageSrc($setup){
        $setup->getConnection()->addColumn(
            $setup->getTable('dd_productdesigner_image'),
            'image_src',
            [
                'type' => \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
                'nullable' => true,
                'comment' => 'Magento product image source'
            ]
        );
    }
}
