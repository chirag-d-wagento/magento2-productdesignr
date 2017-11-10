<?php

namespace Develo\Designer\Setup;

use Magento\Framework\Setup\UpgradeSchemaInterface;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Setup\SchemaSetupInterface;

use Magento\Eav\Setup\EavSetup;
use Magento\Eav\Setup\EavSetupFactory;
use Magento\Framework\Setup\ModuleDataSetupInterface;


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
        
        if (version_compare($context->getVersion(), '1.0.2') < 0){
            echo 'Add cart items tables' . "\n";
            $this->initTmpDesignTable($setup);
            $this->initDesignCartItemsTable($setup);
            
        }
        
        if (version_compare($context->getVersion(), '1.0.3') < 0){
            echo 'Add product id field' . "\n";
            $this->initFeildProductId($setup);
        }
        
        if (version_compare($context->getVersion(), '1.0.4') < 0){
            echo 'Add order table' . "\n";
            $this->initOrderTable($setup);
        }
        
        if (version_compare($context->getVersion(), '1.0.5') < 0){
            echo 'Add extra config field' . "\n";
            $this->initExtraConfField($setup);
        }
        
        if (version_compare($context->getVersion(), '1.0.6') < 0){
            echo 'Add media id field to tmp designs' . "\n";
            $this->initMediaIdField($setup);
        }
        
        $setup->endSetup();

    }   
    
    protected function initMediaIdField($setup) {
        $setup->getConnection()->addColumn(
            $setup->getTable('dd_productdesigner_tmp_designs'),
            'media_id',
            [
                'type' => \Magento\Framework\DB\Ddl\Table::TYPE_INTEGER,
                'nullable' => true,
                'comment' => 'Media ID magento field'
            ]
        );
    }
    
    protected function initExtraConfField($setup) {
        $setup->getConnection()->addColumn(
            $setup->getTable('dd_productdesigner_image'),
            'extra_config',
            [
                'type' => \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
                'nullable' => true,
                'comment' => 'Extra Configuration'
            ]
        );
    }
    
    protected function initOrderTable($setup) {
        $table_orders = $setup->getConnection()
                ->newTable($setup->getTable('dd_productdesigner_order'))
                ->addColumn(
                        'item_id', \Magento\Framework\DB\Ddl\Table::TYPE_INTEGER, null, ['identity' => true, 'unsigned' => true, 'nullable' => false, 'primary' => true, 'autoincrement' => true], 'Id'
                )
                ->addColumn(
                        'magento_order_id', \Magento\Framework\DB\Ddl\Table::TYPE_TEXT, null, ['nullable' => true], 'Magento Order Id'
                )
                
        ;
        $setup->getConnection()->createTable($table_orders);
    }
    
    protected function initFeildProductId($setup) {
        $setup->getConnection()->addColumn(
            $setup->getTable('dd_productdesigner_cart_items'),
            'magento_product_id',
            [
                'type' => \Magento\Framework\DB\Ddl\Table::TYPE_INTEGER,
                'nullable' => true,
                'comment' => 'Magento product ID'
            ]
        );
    }

    protected function initTmpDesignTable($setup) {
        
        $table_tmp_designs = $setup->getConnection()
                ->newTable($setup->getTable('dd_productdesigner_tmp_designs'))
                ->addColumn(
                        'design_id', \Magento\Framework\DB\Ddl\Table::TYPE_INTEGER, null, ['identity' => true, 'unsigned' => true, 'nullable' => false, 'primary' => true, 'autoincrement' => true], 'Id'
                )
                ->addColumn(
                        'created_time', \Magento\Framework\DB\Ddl\Table::TYPE_DATETIME, null, ['nullable' => true, 'default' => null], 'Time of creation'
                )
                ->addColumn(
                        'updated_time', \Magento\Framework\DB\Ddl\Table::TYPE_DATETIME, null, ['nullable' => true, 'default' => null], 'Time of last update'
                )
                ->addColumn(
                        'unique_id', \Magento\Framework\DB\Ddl\Table::TYPE_TEXT, null, ['default' => null, 'nullable' => true], 'Unique id of design'
                )
                ->addColumn(
                        'json_text', \Magento\Framework\DB\Ddl\Table::TYPE_TEXT, null, ['default' => null, 'nullable' => true], 'Fabricjs toJson output'
                )
                ->addColumn(
                        'png_blob', \Magento\Framework\DB\Ddl\Table::TYPE_BLOB, null, ['default' => null, 'nullable' => true], 'PNG Image'
                )
                ->addColumn(
                        'conf', \Magento\Framework\DB\Ddl\Table::TYPE_TEXT, null, ['default' => null, 'nullable' => true], 'DD Designer layers configuration'
                )
                
                ;
        
        $setup->getConnection()->createTable($table_tmp_designs);
    }
    
    protected function initDesignCartItemsTable($setup) {
        
        $table_design_cart_items = $setup->getConnection()
                ->newTable($setup->getTable('dd_productdesigner_cart_items'))
                ->addColumn(
                        '_item_id', \Magento\Framework\DB\Ddl\Table::TYPE_INTEGER, null, ['identity' => true, 'unsigned' => true, 'nullable' => false, 'primary' => true, 'autoincrement' => true], 'Id'
                )
                ->addColumn(
                        'cart_quote_id', \Magento\Framework\DB\Ddl\Table::TYPE_INTEGER, null, ['default' => 0, 'nullable' => false], 'Magento Quote Id'
                )
                ->addColumn(
                        'cart_item_id', \Magento\Framework\DB\Ddl\Table::TYPE_INTEGER, null, ['default' => 0, 'nullable' => false], 'Magento Quote Cart Item Id'
                )
                ->addColumn(
                        'old_cart_quote_id', \Magento\Framework\DB\Ddl\Table::TYPE_INTEGER, null, ['default' => 0, 'nullable' => false], 'Magento Old Quote Id after quote_merge'
                )
                ->addColumn(
                        'old_cart_item_id', \Magento\Framework\DB\Ddl\Table::TYPE_INTEGER, null, ['default' => 0, 'nullable' => false], 'Magento Old Quote Cart Item Id after quote_merge'
                )
                ->addColumn(
                        'created_time', \Magento\Framework\DB\Ddl\Table::TYPE_DATETIME, null, ['nullable' => true, 'default' => null], 'Time of creation'
                )
                ->addColumn(
                        'updated_time', \Magento\Framework\DB\Ddl\Table::TYPE_DATETIME, null, ['nullable' => true, 'default' => null], 'Time of last update'
                )
                ->addColumn(
                        'json_text', \Magento\Framework\DB\Ddl\Table::TYPE_TEXT, null, ['default' => null, 'nullable' => true], 'Fabricjs toJson output'
                )
                ->addColumn(
                        'png_blob', \Magento\Framework\DB\Ddl\Table::TYPE_BLOB, null, ['default' => null, 'nullable' => true], 'PNG Image'
                )
                ->addColumn(
                        'conf', \Magento\Framework\DB\Ddl\Table::TYPE_TEXT, null, ['default' => null, 'nullable' => true], 'DD Designer layers configuration'
                )
                ;
        
        $setup->getConnection()->createTable($table_design_cart_items);
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
