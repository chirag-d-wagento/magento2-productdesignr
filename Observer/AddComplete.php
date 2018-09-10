<?php

namespace Develodesign\Designer\Observer;

use Magento\Framework\Event\Observer;
use Magento\Framework\Event\ObserverInterface;
use Magento\Framework\Stdlib\DateTime\DateTime;

class AddComplete implements ObserverInterface {

    protected $_cart;
    protected $_tmpDesignModel;
    protected $_cartItem;
    protected $_logger;
    protected $_date;
    protected $_registry;
    protected $_designerHelper;

    public function __construct(
        \Magento\Checkout\Model\Cart $cart,
        \Develodesign\Designer\Model\TmpdesignFactory $tmpDesignModel,
        \Develodesign\Designer\Model\CartitemFactory $cartItem,
        \Develodesign\Designer\Helper\Data $designerHelper,
        DateTime $date,
        \Psr\Log\LoggerInterface $logger,
        \Magento\Framework\Registry $registry
    ) {
        $this->_cart = $cart;
        $this->_tmpDesignModel = $tmpDesignModel;
        $this->_cartItem = $cartItem;
        $this->_logger = $logger;
        $this->_date = $date;
        $this->_registry = $registry;
        $this->_designerHelper = $designerHelper;
    }

    public function execute(Observer $observer) {
        $request = $observer->getRequest();
        $designsIds = $request->getParam('dd_design',null);
        if(!empty($designsIds) && $this->_designerHelper->getIsDesignerEnabled()) {

            if($quoteItem = $this->getLastQuoteItem()) {
                $this->removeOldDesigns($quoteItem->getId());
                $this->run($designsIds, $quoteItem);
            } else {
                $this->_logger->critical('Unknown quote dd_designer add complete!');
            }

        }
    }

    public function run($designsIds, $quoteItem) {

            foreach ($designsIds as $designId) {
                $modelCartItem = $this->_cartItem->create()->load(null); //new one!
                $tmpDesign = $this->_tmpDesignModel->create()->load($designId, 'unique_id');

                if (!$tmpDesign->getId()) {
                    $this->_logger->critical('Unknown tmpdesign for product id: ' . $productId . ' - Cart addcomplete event!');
                    continue;
                }

                $modelCartItem->setCartQuoteId($quoteItem->getQuote()->getId())
                    ->setCartItemId($quoteItem->getId())
                    ->setCreatedTime($this->_date->gmtDate())
                    ->setJsonText($tmpDesign->getJsonText())
                    ->setSvgText($tmpDesign->getSvgText())
                    ->setPngBlob($tmpDesign->getPngBlob())
                    ->setMagentoProductId($quoteItem->getProduct()->getId())
                    ->setConf($tmpDesign->getConf())
                    ->save();

            }

    }

    protected function removeOldDesigns($cartItemId) {
        $collection = $this->_cartItem->create()
                ->getCollection();
        $collection->getSelect()->where('cart_item_id=?', $cartItemId);
        $collection->walk('delete');
    }

    protected function getLastQuoteItem(){
      $cartItems = $this->_cart->getQuote()->getAllItems();
      $productDesigns = $this->_registry->registry(\Develodesign\Designer\Observer\AddAfter::CURRENT_REGISTRATED_PRODUCT_DESIGNS);
      foreach ($cartItems as $cartItem) {
          if ($cartItem->getDesignId() == $productDesigns) {
                return $cartItem;
          }
      }


       /*
        $cartItems = $this->_cart->getQuote()->getAllItems();
        $cartItem = end($cartItems);
        if($parentId = $cartItem->getParentItemId()) {
            foreach ($cartItems as $_cartItem) {
                if($parentId == $_cartItem->getId()) {
                    return $_cartItem;
                }

            }
            return false;
        }
        return $cartItem;
        */
    }

}
