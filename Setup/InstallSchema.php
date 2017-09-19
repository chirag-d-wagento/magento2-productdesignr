<?php

namespace Develo\Designer\Setup;

use Magento\Framework\Setup\InstallSchemaInterface;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Setup\SchemaSetupInterface;

class InstallSchema implements InstallSchemaInterface {

    public function install(SchemaSetupInterface $setup, ModuleContextInterface $context) {
        
        $installer = $setup;
        $installer->startSetup();

        /* table designer product images groups */
        $table_image_groups = $installer->getConnection()
                ->newTable($installer->getTable('dd_productdesigner_image_groups'))
                ->addColumn(
                        'group_id', \Magento\Framework\DB\Ddl\Table::TYPE_INTEGER, null, ['identity' => true, 'unsigned' => true, 'nullable' => false, 'primary' => true, 'autoincrement' => true], 'Id'
                )
                ->addColumn(
                        'system_product_id', \Magento\Framework\DB\Ddl\Table::TYPE_INTEGER, null, ['default' => 0, 'nullable' => false], 'Magento Product Id'
                )
                ->addColumn(
                        'group_name', \Magento\Framework\DB\Ddl\Table::TYPE_TEXT, null, ['default' => null, 'nullable' => true], 'Custom name'
                )
                ->addColumn(
                        'priority', \Magento\Framework\DB\Ddl\Table::TYPE_INTEGER, 3, ['default' => 0, 'nullable' => false], 'Group Priority'
                )
                ->addColumn(
                        'created_time', \Magento\Framework\DB\Ddl\Table::TYPE_DATETIME, null, ['nullable' => true, 'default' => null], 'Time of creation'
                )
                ->addColumn(
                        'updated_time', \Magento\Framework\DB\Ddl\Table::TYPE_DATETIME, null, ['nullable' => true, 'default' => null], 'Time of last update'
                )


        ;
        $installer->getConnection()->createTable($table_image_groups);
        
        /* table images */
        $table_images = $installer->getConnection()
                ->newTable($installer->getTable('dd_productdesigner_image'))
                ->addColumn(
                        'image_id', \Magento\Framework\DB\Ddl\Table::TYPE_INTEGER, null, ['identity' => true, 'unsigned' => true, 'nullable' => false, 'primary' => true, 'autoincrement' => true], 'Id'
                )
                ->addColumn(
                        'system_child_product_id', \Magento\Framework\DB\Ddl\Table::TYPE_INTEGER, null, ['default' => 0, 'nullable' => false], 'Magento Product Id Child'
                )
                ->addColumn(
                        'media_id', \Magento\Framework\DB\Ddl\Table::TYPE_INTEGER, null, ['default' => 0, 'nullable' => false], 'Magento Media Id'
                )
                ->addColumn(
                        'group_id', \Magento\Framework\DB\Ddl\Table::TYPE_INTEGER, null, ['default' => 0, 'nullable' => false], 'Parent Group Id'
                )
                ->addColumn(
                        'priority', \Magento\Framework\DB\Ddl\Table::TYPE_INTEGER, 3, ['default' => 0, 'nullable' => false], 'Group Priority'
                )
                ->addColumn(
                        'config', \Magento\Framework\DB\Ddl\Table::TYPE_TEXT, null, ['default' => null, 'nullable' => true], 'Image Product designer configurataion'
                )
                ->addColumn(
                        'created_time', \Magento\Framework\DB\Ddl\Table::TYPE_DATETIME, null, ['nullable' => true, 'default' => null], 'Time of creation'
                )
                ->addColumn(
                        'updated_time', \Magento\Framework\DB\Ddl\Table::TYPE_DATETIME, null, ['nullable' => true, 'default' => null], 'Time of last update'
                )
                
        ;
        
        $installer->getConnection()->createTable($table_images);
        $installer->endSetup();
    }

}
