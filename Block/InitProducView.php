<?php

namespace Develo\Designer\Block;

class InitProducView extends \Magento\Backend\Block\AbstractBlock {
	/**
	 * @override
	 * @see \Magento\Backend\Block\AbstractBlock::_construct()
	 * @return void
	 */
	protected function _construct() {
		/** http://devdocs.magento.com/guides/v2.0/architecture/view/page-assets.html#m2devgde-page-assets-api */
		/** @var \Magento\Framework\App\ObjectManager $om */
		$om = \Magento\Framework\App\ObjectManager::getInstance();
		/** @var \Magento\Framework\View\Page\Config $page */
		$page = $om->get('Magento\Framework\View\Page\Config');
		$page->addPageAsset('Develo_Designer::css/product_view.css');
		$page->addPageAsset('Develo_Designer::css/dd_productdesigner.css');
	}
}
