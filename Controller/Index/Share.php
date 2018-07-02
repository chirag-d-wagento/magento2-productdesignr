<?php

namespace Develodesign\Designer\Controller\Index;

use Magento\Framework\Controller\ResultFactory;
use Magento\Framework\Stdlib\DateTime\DateTime;

class Share extends \Magento\Framework\App\Action\Action
{

    const SHARE_PATH = 'dd_share';
    const SHARE_FB_URL = 'https://facebook.com/share.php?u=';
    const SHARE_TWITTER_URL = 'https://www.twitter.com/share?url=';
    const SHARE_PIN_URL = 'https://pinterest.com/pin/create/link/?url=';

    protected $_fileUploaderFactory;
    protected $_filesystem;
    protected $_storeManager;
    protected $_ioAdapter;
    protected $_shareModel;
    protected $formKeyValidator;
    protected $_date;
    
    protected $_shareUrlFull;
    
    public function __construct(
        \Magento\Framework\App\Action\Context $context, 
        \Magento\Framework\Filesystem $filesystem, 
        \Magento\Store\Model\StoreManagerInterface $storeManager, 
        \Magento\Framework\Filesystem\Io\File $ioAdapter, 
        DateTime $date, 
        \Magento\Framework\Data\Form\FormKey\Validator $formKeyValidator, 
        \Develodesign\Designer\Model\ShareFactory $shareModel
    )
    {
        parent::__construct($context);

        $this->_filesystem = $filesystem;
        $this->_storeManager = $storeManager;

        $this->_ioAdapter = $ioAdapter;
        $this->_shareModel = $shareModel;
        $this->formKeyValidator = $formKeyValidator;

        $this->_date = $date;
    }

    public function execute()
    {

        if (!$this->formKeyValidator->validate($this->getRequest())) {
            return '';
        }

        $type = $this->getRequest()->getParam('type');
        $img = $this->getRequest()->getParam('img');

        if (!$type || !$img) {
            return;
        }
        try {
            $reader = $this->_filesystem->getDirectoryRead(\Magento\Framework\App\Filesystem\DirectoryList::MEDIA);
            $path = $reader->getAbsolutePath(self::SHARE_PATH . '/');
            $fileName = uniqid() . '.png';

            if (!is_dir($path)) {
                $this->_ioAdapter->mkdir($path, 0775);
            }

            $this->_ioAdapter->open(array('path' => $path));
            $this->_ioAdapter->write($fileName, $this->prepareImgData($img), 0666);

            $fileUrl = $this->_storeManager
                            ->getStore()
                            ->getBaseUrl(\Magento\Framework\UrlInterface::URL_TYPE_MEDIA) .
                    self::SHARE_PATH . '/' . $fileName;

            $uniqueId = uniqid();

            $productId = strip_tags($this->getRequest()->getParam('product_id'));
            $shareConfig = $this->getRequest()->getParam('share_config');

            $model = $this->_shareModel->create()
                    ->load(null);

            $model->setShareUniqueId($uniqueId)
                    ->setSystemProductId($productId)
                    ->setShareConfig($shareConfig)
                    ->setShareUrl($fileUrl)
                    ->setCreatedTime($this->_date->gmtDate())
            ;
            
            $shareUrl = $this->prepareShareUrl($type, $fileUrl, $productId, $uniqueId);
            $model->setShareUrlFull($this->_shareUrlFull);
            
            
            $model->save();

            return $this->sendResponse([
                        'success' => true,
                        'src' => $fileUrl,
                        'share_url' => $shareUrl
            ]);
        } catch (\Exception $ex) {
            return $this->sendError(__('Error') . ': ' . $ex->getMessage());
        }
    }

    protected function prepareShareUrl($type, $fileUrl, $productId, $uniqueId)
    {
        switch ($type) {
            case 'facebook':
                return $this->prepareShareFbUrl($fileUrl, $productId, $uniqueId);
                break;

            case 'twitter':
                return $this->prepareShareTwUrl($fileUrl, $productId, $uniqueId);
                break;

            case 'pinterest':
                return $this->prepareSharePnUrl($fileUrl, $productId, $uniqueId);
                break;
        }
    }

    protected function getShareBaseUrl($productId, $uniqueId, $fileUrl)
    {
        $this->_shareUrlFull = $this->_url->getUrl('catalog/product/view', [
            'id' => $productId,
            'design_id' => $uniqueId,
          //  'image' => serialize($fileUrl)
        ]);
        
        return $this->_shareUrlFull;
    }

    protected function prepareSharePnUrl($fileUrl, $productId, $uniqueId)
    {
        return self::SHARE_PIN_URL . $this->getShareBaseUrl($productId, $uniqueId, $fileUrl);
    }

    protected function prepareShareTwUrl($fileUrl, $productId, $uniqueId)
    {
        return self::SHARE_TWITTER_URL . $this->getShareBaseUrl($productId, $uniqueId, $fileUrl);
    }

    protected function prepareShareFbUrl($fileUrl, $productId, $uniqueId)
    {
        return self::SHARE_FB_URL . $this->getShareBaseUrl($productId, $uniqueId, $fileUrl);
    }

    protected function prepareImgData($img)
    {
        //decodedData = atob(encodedData);
        $dataEncoded = explode(',', $img);
        return base64_decode($dataEncoded[1]);
    }

    protected function sendError($errMessage)
    {
        return $this->sendResponse([
                    'error' => true,
                    'errMessage' => $errMessage
        ]);
    }

    protected function sendResponse($response = array())
    {

        $jsonResponse = $this->resultFactory->create(ResultFactory::TYPE_JSON);
        $jsonResponse->setData($response);
        return $jsonResponse;
    }

}
