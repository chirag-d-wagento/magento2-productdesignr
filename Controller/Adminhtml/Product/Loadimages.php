<?php

namespace Develodesign\Designer\Controller\Adminhtml\Product;

use Magento\Framework\Controller\ResultFactory;
use Magento\ConfigurableProduct\Api\LinkManagementInterface;

class Loadimages extends \Magento\Backend\App\Action {

    protected $_productLoader;
    protected $_productRepo;
    protected $_groups = [];
    protected $_linkManagement;

    public function __construct(
        \Magento\Backend\App\Action\Context $context, 
        LinkManagementInterface $linkManagement, 
        \Magento\Catalog\Api\ProductRepositoryInterface $productRepo,    
        \Magento\Catalog\Model\ProductFactory $productLoader
    ) {
        parent::__construct($context);
        $this->_productLoader = $productLoader;
        $this->_linkManagement = $linkManagement;
        $this->_productRepo = $productRepo;
    }

    public function execute() {
        $pid = $this->getRequest()->getParam('product_id');
        $psku = $this->getRequest()->getParam('product_sku');
        $this->groups = $this->getRequest()->getParam('groups');
        //$groupIndex = $this->getRequest()->getParam('group_index');

        if (!$pid) {
            return $this->sendResponse([
                        'error' => true,
                        'errorMessage' => __('Not all data sent!')
            ]);
        }

        $product = $this->getProduct($pid);
        if (!$product->getId()) {
            return $this->sendResponse([
                        'error' => true,
                        'errorMessage' => __('Produt not found!')
            ]);
        }

        return $this->sendResponse([
                    'success' => true,
                    'data' => $this->getProductImages($product),
                    'parent' =>
                    [ 
                        'psku' => $product->getSku(),
                        'product_id' => $product->getId(),
                        'product_name' => $product->getName(),
                        'no_images_text' => __('No Images found for this product!')
                    ]
            
        ]);
    }

    protected function getProductImages($product) {
        $out = [];

        if ($product->getTypeId() == 'configurable') {
            $childProducts = $this->_linkManagement
                    ->getChildren($product->getSku());
            
            foreach ($childProducts as $child) {
                $product = $this->getProduct($child->getSku(), true);
                $out[] = [
                    'imgs' => $this->loadImages($product),
                    'extra' => [
                        'psku' => $product->getSku(),
                        'product_id' => $product->getId(),
                        'product_name' => $product->getName(),
                        //'no_images_text' => __('No Images found for this product!'),
                        'group_index' => (!empty($this->groups[$product->getId()]) ? $this->groups[$product->getId()] : false)
                    ]
                ];
            }
            //$out[] = [];
        } else {
            $out[] = [
                'imgs' => $this->loadImages($product),
                'extra' => [
                    'psku' => $product->getSku(),
                    'product_id' => $product->getId(),
                    'product_name' => $product->getName(),
                    //'no_images_text' => __('No Images found for this product!'),
                    'group_index' => (!empty($this->groups[$product->getId()]) ? $this->groups[$product->getId()] : false)
                ]
            ];
        }

        return $out;
    }

    protected function loadImages($product, $reload = false) {
        $images = [];
        if($reload) {
            $product = $this->getProduct($product->getSku(), true);
        }
        $media = $product->getMediaGalleryImages();
        foreach ($media as $image) {
            $images[] = [
                'src' => $image->getUrl(),
                'media_id' => $image->getId(),
                'sku' => $product->getSku(),
                'product_id' => $product->getId()
            ];
        }

        return $images;
    }

    protected function getProduct($pid, $bySku = false) {
        if($bySku) {
            return $this->_productRepo->get($pid);
        }
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
