<?php

namespace Develo\Designer\Ui\DataProvider\Product\Form\Modifier;

use Magento\Catalog\Model\Locator\LocatorInterface;
use Magento\Catalog\Ui\DataProvider\Product\Form\Modifier\AbstractModifier;
use Magento\Ui\Component\Form;
use Magento\Framework\UrlInterface;


class Designer extends AbstractModifier {

    const PRODUCT_DESIGNER = 'product_designer';
    const GROUP_CONTENT = 'content';
    const SORT_ORDER = 21;

    /**
     * @var LocatorInterface
     */
    protected $locator;

    /**
     * @var UrlInterface
     */
    protected $urlBuilder;
    
    protected $_assetRepo;
    
    protected $_designerFonts;

    public function __construct(
        LocatorInterface $locator, 
        \Magento\Framework\View\Asset\Repository $assetRepo,  
        \Develo\Designer\Helper\Fonts $designerFonts,    
        UrlInterface $urlBuilder
    ) {
        $this->locator    = $locator;
        $this->urlBuilder = $urlBuilder;
        $this->_assetRepo = $assetRepo;
        $this->_designerFonts = $designerFonts;
    }

    public function modifyMeta(array $meta) {

        if (!$this->locator->getProduct()->getId()) {
            return $meta;
        }

        $meta[self::PRODUCT_DESIGNER] = [
            'children' => [
                'designerPanel' => [
                    'arguments' => [
                        'data' => [
                            'config' => [
                                'sortOrder' => 1,
                                'formElement' => 'container',
                                'componentType' => 'container',
                                'dataScope' => '',
                                'component' => 'Develo_Designer/js/designer',
                                'provider' => 'product_form.product_form_data_source',
                                'title' => __('Set Default'),
                                'label' => __('Default'),
                                'saveUrl' => $this->urlBuilder->getUrl('dd_productdesigner/save'),
                                'cssUrl' => $this->_assetRepo->getUrl("Develo_Designer::css/dd_productdesigner.css"),
                                'urlImages' => $this->urlBuilder->getUrl('dd_productdesigner/product/images'),
                                'urlLoadImages' => $this->urlBuilder->getUrl('dd_productdesigner/product/loadimages'),
                                'urlUploadImages' => $this->urlBuilder->getUrl('dd_productdesigner/image/upload'),
                                'urlSaveData' => $this->urlBuilder->getUrl('dd_productdesigner/group/save'),
                                'fonts' => $this->_designerFonts->getFonts(),
                                'myFilesPath' => $this->urlBuilder->getUrl('dd_productdesigner/product/myfiles')
                            ],
                        ],
                    ],
                ]
            ],
            'arguments' => [
                'data' => [
                    'config' => [
                        'label' => __('Product Designer'),
                        'collapsible' => true,
                        'opened' => false,
                        'componentType' => Form\Fieldset::NAME,
                        'sortOrder' =>
                        $this->getNextGroupSortOrder(
                                $meta, static::GROUP_CONTENT, static::SORT_ORDER
                        ),
                    ],
                ],
            ]
        ];

        return $meta;
    }

    public function modifyData(array $data) {
        return $data;
    }

}
