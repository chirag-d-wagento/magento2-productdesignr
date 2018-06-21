<?php

namespace Develodesign\Designer\Ui\DataProvider\Product\Form\Modifier;

use Magento\Catalog\Model\Locator\LocatorInterface;
use Magento\Catalog\Ui\DataProvider\Product\Form\Modifier\AbstractModifier;
use Magento\Ui\Component\Form;
use Magento\Framework\UrlInterface;
use Magento\Ui\Component\Form\Field;
use Magento\Ui\Component\Form\Fieldset;
use Magento\Ui\Component\Form\Element\Hidden;
use Magento\Ui\Component\Form\Element\Input;
use Magento\Ui\Component\Form\Element\DataType\Text;

class Designer extends AbstractModifier {

    const PRODUCT_DESIGNER = 'product_designer';
    const GROUP_CONTENT = 'content';
    const SORT_ORDER = 21;
    const FIELD_NAME_TEXT = 'dd-designer-conf';

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
    protected $_designerHelper;

    public function __construct(
    LocatorInterface $locator, \Magento\Framework\View\Asset\Repository $assetRepo, \Develodesign\Designer\Helper\Fonts $designerFonts, \Develodesign\Designer\Helper\Data $designerHelper, UrlInterface $urlBuilder
    ) {
        $this->locator = $locator;
        $this->urlBuilder = $urlBuilder;
        $this->_assetRepo = $assetRepo;
        $this->_designerFonts = $designerFonts;

        $this->_designerHelper = $designerHelper;
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
                                'componentType' => Fieldset::NAME,
                                'dataScope' => static::DATA_SCOPE_PRODUCT,
                                
                                'component' => 'Develodesign_Designer/js/designer',
                                'provider' => 'product_form.product_form_data_source',
                                'title' => __('Set Default'),
                                'label' => __('Default'),
                                'saveUrl' => $this->urlBuilder->getUrl('dd_productdesigner/save'),
                                'cssUrl' => $this->_assetRepo->getUrl("Develodesign_Designer::css/dd_productdesigner.css"),
                                'urlImages' => $this->urlBuilder->getUrl('dd_productdesigner/product/images'),
                                'urlLoadImages' => $this->urlBuilder->getUrl('dd_productdesigner/product/loadimages'),
                                'urlUploadImages' => $this->urlBuilder->getUrl('dd_productdesigner/image/upload'),
                                'urlSaveData' => $this->urlBuilder->getUrl('dd_productdesigner/group/save'),
                                'fonts' => $this->_designerFonts->getFonts(),
                                'myFilesPath' => $this->urlBuilder->getUrl('dd_productdesigner/product/myfiles'),
                                'defaultImgEnabled' => $this->_designerHelper->getIsAddImageEnabled(),
                                'defaultTextEnabled' => $this->_designerHelper->getIsAddTextEnabled(),
                                'defaultLibraryEnabled' => $this->_designerHelper->getIsAddFromLibraryEnabled(),
                                'defaultTextPrice' => $this->_designerHelper->getLayerTextPrice(),
                                'defaultImgPrice' => $this->_designerHelper->getLayerImgPrice(),
                                'libraryPath' => $this->urlBuilder->getUrl('dd_productdesigner/library/index')
                            ],
                        ],
                    ]
                ],
                //static::FIELD_NAME_TEXT => $this->getTextFieldConfig(),
            ],
            
            'arguments' => [
                'data' => [
                    'config' => [
                        'label' => __('Product Designer'),
                        'collapsible' => true,
                        'opened' => false,
                        
                        'dataScope' => static::DATA_SCOPE_PRODUCT, // save data in the product data
                        'provider' => static::DATA_SCOPE_PRODUCT . '_data_source',
                        'ns' => static::FORM_NAME,

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

    protected function getTextFieldConfig() {
        return [
            'arguments' => [
                'data' => [
                    'config' => [
                        'formElement' => Field::NAME,
                        'componentType' => Input::NAME,
                        'dataScope' => self::FIELD_NAME_TEXT
                    ],
                ],
            ],
        ];
    }

    public function modifyData(array $data) {
        return $data;
    }

}
