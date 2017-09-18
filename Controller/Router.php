<?php

namespace Develo\Designer\Controller;

class Router implements \Magento\Framework\App\RouterInterface {

    protected $_designerHelper;
    
    protected $actionFactory;
    
    protected $_modelProduct;

    public function __construct(
        \Develo\Designer\Helper\Data $designerHelper, 
        \Magento\Framework\App\ActionFactory $actionFactory,    
        \Magento\Catalog\Model\Product $modelProduct
    ) {

        $this->actionFactory = $actionFactory;
        $this->_designerHelper = $designerHelper;
        $this->_modelProduct = $modelProduct;
    }

    public function match(\Magento\Framework\App\RequestInterface $request) {
        if (!$this->_designerHelper->getIsDesignerEnabled()) {
            return;
        }

        $identifier = trim($request->getPathInfo(), '/');
        if ($identifier == '' || !$identifier) {
            return;
        }

        $pid = $request->getParam(\Develo\Designer\Helper\Url::PRODUCT_ID_VAR_NAME);
        if (!$pid) {
            return;
        }
        $_product = $this->_modelProduct->load($pid);
        //validate product
        if (!$_product->getId() || !$this->_designerHelper->getIsActiveOnProductView($_product)) {
            return;
        }

        $request
                ->setModuleName('dd_designer')
                ->setControllerName('index')
                ->setActionName('view')
                ->setParam(\Develo\Designer\Helper\Url::PRODUCT_ID_VAR_NAME, $pid);
        
        $request->setAlias(\Magento\Framework\Url::REWRITE_REQUEST_PATH_ALIAS, $identifier);
        return $this->actionFactory->create('Magento\Framework\App\Action\Forward');
    }

}
