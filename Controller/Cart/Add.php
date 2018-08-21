<?php

namespace Develodesign\Designer\Controller\Cart;

use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\Checkout\Model\Cart as CustomerCart;
use Magento\Framework\Exception\NoSuchEntityException;

/**
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 */
class Add extends \Magento\Checkout\Controller\Cart\Add
{

    protected $_tmpDesignModel;

    /**
     * @param \Magento\Framework\App\Action\Context $context
     * @param \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig
     * @param \Magento\Checkout\Model\Session $checkoutSession
     * @param \Magento\Store\Model\StoreManagerInterface $storeManager
     * @param \Magento\Framework\Data\Form\FormKey\Validator $formKeyValidator
     * @param CustomerCart $cart
     * @param ProductRepositoryInterface $productRepository
     * @codeCoverageIgnore
     */
    public function __construct(
        \Magento\Framework\App\Action\Context $context,
        \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig,
        \Magento\Checkout\Model\Session $checkoutSession,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Magento\Framework\Data\Form\FormKey\Validator $formKeyValidator,
        CustomerCart $cart,
        ProductRepositoryInterface $productRepository,
        \Develodesign\Designer\Helper\Data $designerHelper,
        \Develodesign\Designer\Model\TmpdesignFactory $tmpDesignModel
    ) {
        parent::__construct(
            $context,
            $scopeConfig,
            $checkoutSession,
            $storeManager,
            $formKeyValidator,
            $cart,
            $productRepository
        );
        $this->_designerHelper = $designerHelper;
        $this->productRepository = $productRepository;
        $this->_tmpDesignModel = $tmpDesignModel;
    }


    /**
     * Add product to shopping cart action
     *
     * @return \Magento\Framework\Controller\Result\Redirect
     * @SuppressWarnings(PHPMD.CyclomaticComplexity)
     */
    public function execute()
    {

        if (!$this->_formKeyValidator->validate($this->getRequest())) {
            return $this->resultRedirectFactory->create()->setPath('*/*/');
        }

        $params = $this->getRequest()->getParams();

        $multiAddtocartAttributeId = $this->_designerHelper->getMultipleAddtocartAttribute();
        if(!$multiAddtocartAttributeId || empty($params['super_attribute'][$multiAddtocartAttributeId])){
            return parent::execute();
        }

        try {

            $_product = $this->_initProduct();
            if (!$_product) { return $this->goBack(); }

            //Check params and reformat to add seperate products if multiple option/quantity specified
            $multiOptions = (array) json_decode($params['super_attribute'][$multiAddtocartAttributeId]);
            foreach($multiOptions as $optionId=>$qty){

                //Using same product object does not allow multi-add
                $_product = $this->_objectManager->create('\Magento\Catalog\Model\Product')->load($params['product']);

                //Copy request params, updating multi-super-attribute option and qty
                $productParams = $params;
                $productParams['super_attribute'][$multiAddtocartAttributeId] = $optionId;
                $productParams['qty'] = intval($qty);
                $this->cart->addProduct($_product, $productParams);
                $this->cart->save();

                /**
                 * @todo remove wishlist observer \Magento\Wishlist\Observer\AddToCart
                 */
                $this->_eventManager->dispatch(
                    'checkout_cart_add_product_complete',
                    ['product' => $_product, 'request' => $this->getRequest(), 'response' => $this->getResponse()]
                );

            }

            /* Update quote items totals to fix an issue with item subtotals incorrect in cart after multi-add */
            $this->_checkoutSession->getQuote()->setTotalsCollectedFlag(false)->collectTotals()->save();
            //$this->cart->collectTotals()->save();

            //remove tmp design after all multi-add products have been added to cart (they use the same tmp design id)
            if(!empty($params['dd_design'])) {
                $designsIds = $params['dd_design'];
                foreach ($designsIds as $designId) {
                    $tmpDesign = $this->_tmpDesignModel->create()->load($designId, 'unique_id');
                    $tmpDesign->delete();
                }
            }


            if (!$this->_checkoutSession->getNoCartRedirect(true)) {
                if (!$this->cart->getQuote()->getHasError()) {
                    $message = __(
                        'You added %1 to your shopping cart.',
                        $_product->getName()
                    );
                    $this->messageManager->addSuccessMessage($message);
                }
                return $this->goBack(null, $_product);
            }
        } catch (\Magento\Framework\Exception\LocalizedException $e) {
            if ($this->_checkoutSession->getUseNotice(true)) {
                $this->messageManager->addNotice(
                    $this->_objectManager->get('Magento\Framework\Escaper')->escapeHtml($e->getMessage())
                );
            } else {
                $messages = array_unique(explode("\n", $e->getMessage()));
                foreach ($messages as $message) {
                    $this->messageManager->addError(
                        $this->_objectManager->get('Magento\Framework\Escaper')->escapeHtml($message)
                    );
                }
            }

            $url = $this->_checkoutSession->getRedirectUrl(true);

            if (!$url) {
                $cartUrl = $this->_objectManager->get('Magento\Checkout\Helper\Cart')->getCartUrl();
                $url = $this->_redirect->getRedirectUrl($cartUrl);
            }

            return $this->goBack($url);

        } catch (\Exception $e) {
            $this->messageManager->addException($e, __('We can\'t add this item to your shopping cart right now.') . $e->getMessage());
            $this->_objectManager->get('Psr\Log\LoggerInterface')->critical($e);
            return $this->goBack();
        }
    }
}