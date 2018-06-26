<?php

namespace Develodesign\Designer\Block\Product;

class View extends \Magento\Catalog\Block\Product\AbstractProduct
{

    protected $_designerHelper;
    protected $_helperUrl;
    protected $_designerModel;
    protected $_designerFonts;
    protected $_pricesLayers = [];
    //protected $_storeManager;
    protected $_currency;
    protected $_filterProvider;
    protected $_blockFactory;
    protected $_modelShare;
    protected $_modelShareLoaded;
    protected $_request;
    protected $_confHelpOneBlock = [
        'selector' => '#dd-top-controls',
        'position' => [
            'x' => 'left',
            'y' => 'center'
        ],
        'outside' => 'x'
    ];
    protected $_confHelpTwoBlock = [
        'selector' => '#dd-bottom-controls',
        'position' => [
            'x' => 'center',
            'y' => 'top'
        ],
        'outside' => 'y'
    ];
    protected $_confHelpThreeBlock = [
        'selector' => '#dd-main-controls',
        'position' => [
            'x' => 'left',
            'y' => 'center'
        ],
        'outside' => 'x'
    ];
    protected $_confHelpSwitchBlock = [
        'selector' => '.dd-designer-image-selector',
        'position' => [
            'x' => 'left',
            'y' => 'center'
        ],
        'outside' => 'x'
    ];

    public function __construct(
    \Magento\Catalog\Block\Product\Context $context, \Develodesign\Designer\Helper\Data $designerHelper, \Develodesign\Designer\Helper\Url $helperUrl, \Develodesign\Designer\Helper\Fonts $designerFonts,
    //\Magento\Store\Model\StoreManagerInterface $storeManager, 
            \Magento\Directory\Model\Currency $currency, \Develodesign\Designer\Model\Designer $designerModel, \Magento\Cms\Model\BlockFactory $blockFactory, \Magento\Cms\Model\Template\FilterProvider $filterProvider, \Develodesign\Designer\Model\ShareFactory $modelShare, \Magento\Framework\App\RequestInterface $request, array $data = array()
    )
    {
        parent::__construct($context, $data);

        $this->_designerHelper = $designerHelper;
        $this->_helperUrl = $helperUrl;
        $this->_designerModel = $designerModel;
        $this->_designerFonts = $designerFonts;
        $this->_currency = $currency;
        //$this->_storeManager = $storeManager;

        $this->_filterProvider = $filterProvider;
        $this->_blockFactory = $blockFactory;

        $this->_modelShare = $modelShare;
        $this->_request = $request;
    }

    public function getShareDesign()
    {
        $designId = $this->_request->getParam('design_id');
        if(!$designId) {
            return;
        }
        $this->_modelShareLoaded = $this->_modelShare->create()
                ->load($designId, 'share_unique_id');
        
        if(!$this->_modelShareLoaded->getId()) {
            return;
        }
        
        return $this->_modelShareLoaded->getShareConfig();
    }

    public function showCustomizeButton()
    {
        $product = $this->getProduct();
        return $this->_designerHelper->getIsActiveOnProductView($product);
    }

    public function getCustomizeUrl()
    {
        $product = $this->getProduct();
        return $this->_helperUrl->getProductCustomizeUrl($product);
    }

    public function getDesignerConfiguration($product)
    {
        $config = $this->_designerModel->loadFrontConfiguration($product);
        $this->setLayerPrices($config);
        return json_encode($this->_designerModel->loadFrontConfiguration($product));
    }

    public function getFonts()
    {
        return $this->_designerFonts->getFonts();
    }

    public function getUploadFileUrl()
    {
        return $this->getUrl('dd_designer/index/upload');
    }

    public function getMyFilesUrl()
    {
        return $this->getUrl('dd_designer/index/myfiles');
    }

    public function getSaveDesignUrl()
    {
        return $this->getUrl('dd_designer/index/save');
    }

    public function getLibraryUrl()
    {
        return $this->getUrl('dd_designer/index/library');
    }

    public function getShareUrl()
    {
        return $this->getUrl('dd_designer/index/share');
    }

    public function getFbImagesUrl()
    {
        return $this->getUrl('dd_designer/index/facebook');
    }

    public function getIsAddImageEnabled()
    {
        return $this->_designerHelper->getIsAddImageEnabled();
    }

    public function getIsAddTextEnabled()
    {
        return $this->_designerHelper->getIsAddTextEnabled();
    }

    public function getIsAddFromLibraryEnabled()
    {
        return $this->_designerHelper->getIsAddFromLibraryEnabled();
    }

    public function getIsImportFromFbEnabled()
    {
        return $this->_designerHelper->getIsFbImportEnabled();
    }

    public function getIsInstagramImportEnabled()
    {
        return $this->_designerHelper->getIsInstagramImportEnabled();
    }

    public function getFbAppId()
    {
        return $this->_designerHelper->getFbAppId();
    }

    public function getLayerPrices()
    {
        return json_encode($this->_pricesLayers);
    }

    public function getIsFbShareEnabled()
    {
        return $this->_designerHelper->getIsFbEnabled();
    }

    public function getIsTwShareEnabled()
    {
        return $this->_designerHelper->getIsTwitterShareEnabled();
    }

    public function getIsPintShareEnabled()
    {
        return $this->_designerHelper->getIsPinterestShareEnabled();
    }

    public function getInstagramClientId()
    {
        return $this->_designerHelper->getInstagramClientId();
    }

    public function getHelpDesigner()
    {
        $out = [];
        $switchBlock = $this->getSwitchHelpBlockConf();
        if ($switchBlock !== null) {
            $out[] = [
                'selector' => $this->_confHelpSwitchBlock['selector'],
                'outside' => $this->_confHelpSwitchBlock['outside'],
                'position' => $this->_confHelpSwitchBlock['position'],
                'content' => $switchBlock
            ];
        }

        $helpOneBlock = $this->getHelpOneBlockContent();

        if ($helpOneBlock !== null) {
            $out[] = [
                'selector' => $this->_confHelpOneBlock['selector'],
                'outside' => $this->_confHelpOneBlock['outside'],
                'position' => $this->_confHelpOneBlock['position'],
                'content' => $helpOneBlock
            ];
        }

        $helpTwoBlock = $this->getHelpTwoBlockContent();

        if ($helpTwoBlock !== null) {
            $out[] = [
                'selector' => $this->_confHelpTwoBlock['selector'],
                'outside' => $this->_confHelpTwoBlock['outside'],
                'position' => $this->_confHelpTwoBlock['position'],
                'content' => $helpTwoBlock
            ];
        }

        $helpThreeBlock = $this->getHelpThreeBlockContent();

        if ($helpThreeBlock !== null) {
            $out[] = [
                'selector' => $this->_confHelpThreeBlock['selector'],
                'outside' => $this->_confHelpThreeBlock['outside'],
                'position' => $this->_confHelpThreeBlock['position'],
                'content' => $helpThreeBlock
            ];
        }

        return (count($out) > 0 ? $out : null);
    }

    protected function getHelpOneBlockContent()
    {
        $html = '';
        $blockId = $this->_designerHelper->getHelpFirstBlock();
        $html .= $this->getCmsContentBlock($blockId);
        return $html;
    }

    protected function getHelpTwoBlockContent()
    {
        $html = '';
        $blockId = $this->_designerHelper->getHelpSecondBlock();
        $html .= $this->getCmsContentBlock($blockId);
        return $html;
    }

    protected function getHelpThreeBlockContent()
    {
        $html = '';
        $blockId = $this->_designerHelper->getHelpThirdBlock();
        $html .= $this->getCmsContentBlock($blockId);
        return $html;
    }

    protected function getSwitchHelpBlockConf()
    {
        $html = '';
        $blockId = $this->_designerHelper->getHelpSwitchBlock();
        $html .= $this->getCmsContentBlock($blockId);
        return $html;
    }

    public function getCustomizeButtonHelpText()
    {
        $html = '';
        $blockId = $this->_designerHelper->getHelpCustomizeButton();
        $html .= $this->getCmsContentBlock($blockId);
        return $html;
    }

    protected function getCmsContentBlock($blockId = '')
    {
        $html = '';
        if ($blockId) {
            $storeId = $this->_storeManager->getStore()->getId();
            /** @var \Magento\Cms\Model\Block $block */
            $block = $this->_blockFactory->create();
            $block->setStoreId($storeId)->load($blockId);
            $html = $this->_filterProvider
                    ->getBlockFilter()
                    ->setStoreId($storeId)
                    ->filter($block->getContent());
        }

        return $html;
    }

    protected function setLayerPrices($config)
    {

        if (empty($config[0]) || empty($config[0]['imgs'])) {
            return;
        }

        foreach ($config as $conf) {

            $imgs = $conf['imgs'];

            foreach ($imgs as $img) {
                if (empty($img['media_id'])) {
                    continue;
                }
                $this->_pricesLayers[$img['media_id']]['layer_img_price'] = $this->convertPrice($this->getLayerImgPrice($img));
                $this->_pricesLayers[$img['media_id']]['layer_txt_price'] = $this->convertPrice($this->getLayerTxtPrice($img));
                $this->_pricesLayers[$img['media_id']]['currency'] = $this->getCurrencyCode();
            }
        }
    }

    protected function getLayerImgPrice($conf)
    {
        $extraConf = $this->getExtraConf($conf);
        if (key_exists('layer_img_price', $extraConf)) {
            return $extraConf['layer_img_price'];
        }
        return $this->_designerHelper->getLayerImgPrice();
    }

    protected function getLayerTxtPrice($conf)
    {
        $extraConf = $this->getExtraConf($conf);
        if (key_exists('layer_txt_price', $extraConf)) {
            return $extraConf['layer_txt_price'];
        }
        return $this->_designerHelper->getLayerTextPrice();
    }

    protected function getExtraConf($conf)
    {
        return !empty($conf['extra_config']) ? $conf['extra_config'] : [];
    }

    protected function getCurrencyCode()
    {
        return $this->_storeManager->getStore()->getCurrentCurrency()->getCurrencySymbol();
    }

    protected function convertPrice($basePrice)
    {
        $rate = $this->_storeManager->getStore()->getCurrentCurrencyRate();
        return $rate * $basePrice;
    }

}
