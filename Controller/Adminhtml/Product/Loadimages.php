<?php

namespace Develo\Designer\Controller\Adminhtml\Product;

use Magento\Framework\Controller\ResultFactory;

class Loadimages extends \Magento\Backend\App\Action {
    
    protected $_productLoader;
    
    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Magento\Catalog\Model\ProductFactory $productLoader
    ) {
        parent::__construct($context);
        $this->_productLoader = $productLoader;
    }
    
    public function execute() {
        $pid  = $this->getRequest()->getParam('product_id');
        $psku = $this->getRequest()->getParam('product_sku');
        $groupIndex = $this->getRequest()->getParam('group_index');
        
        if(!$pid) {
            return $this->sendResponse([
                    'error' => true,
                    'errorMessage' => __('Not all data sent!')
                ]);
        }
        
        $product = $this->getProduct($pid);
        if(!$product->getId()) {
            return $this->sendResponse([
                    'error' => true,
                    'errorMessage' => __('Produt not found!')
                ]);
        }
        
        return $this->sendResponse([
            'success' => true,
            'data' => $this->loadImages($product, $groupIndex),
            'extra'=> [
                'psku' => $psku,
                'product_id' => $product->getId(),
                'product_name' => $product->getName(),
                'group_index' => $groupIndex,
                'no_images_text' => __('No Images found for this product!')
            ]
        ]);
    }
    
    protected function loadImages($product, $groupIndex) {
        $images = [];
        foreach($product->getMediaGalleryImages() as $image) {
            $images[] = [
                'src' => $image->getUrl(),
                'media_id' => $image->getId(),
                'group_index' => $groupIndex
            ];
        }
        
        return $images;
        
    }
    
    protected function getProduct($pid) {
        $product = $this->_productLoader->create()
                ->load($pid);
        return $product;
    }
    
    public function sendResponse($response = array()) {
        $jsonResponse = $this->resultFactory->create(ResultFactory::TYPE_JSON);
        $jsonResponse->setData($response);
        return $jsonResponse;
    }
}
