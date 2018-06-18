<?php

namespace Develodesign\Designer\Controller\Index;

use Magento\Framework\Controller\ResultFactory;

class Share extends \Magento\Framework\App\Action\Action{

    const SHARE_PATH = 'dd_share';
    
    const SHARE_FB_URL = 'https://facebook.com/share.php?u=';
    
    const SHARE_TWITTER_URL = 'https://www.twitter.com/share?url=';
    
    const SHARE_PIN_URL = 'https://pinterest.com/pin/create/link/?url=';

    protected $_fileUploaderFactory;
    protected $_filesystem;
    protected $_storeManager;
    protected $_ioAdapter;

    public function __construct(
        \Magento\Framework\App\Action\Context $context, 
        \Magento\Framework\Filesystem $filesystem, 
        \Magento\Store\Model\StoreManagerInterface $storeManager, 
        \Magento\Framework\Filesystem\Io\File $ioAdapter
    ) {
        parent::__construct($context);

        $this->_filesystem = $filesystem;
        $this->_storeManager = $storeManager;

        $this->_ioAdapter = $ioAdapter;
    }

    public function execute() {
        $type = $this->getRequest()->getParam('type');
        $img = $this->getRequest()->getParam('img');
        
        if(!$type || !$img) {
            return;
        }
        try {
            $reader = $this->_filesystem->getDirectoryRead(\Magento\Framework\App\Filesystem\DirectoryList::MEDIA);
            $path = $reader->getAbsolutePath(self::SHARE_PATH . '/');
            $fileName = uniqid() . '.png';

            if (!is_dir($path)) {
                $this->_ioAdapter->mkdir($path, 0775);
            }
            
            $this->_ioAdapter->open(array('path'=>$path));
            $this->_ioAdapter->write($fileName, $this->prepareImgData($img), 0666);
            
            $fileUrl = $this->_storeManager
                                ->getStore()
                                ->getBaseUrl(\Magento\Framework\UrlInterface::URL_TYPE_MEDIA) .
                        self::SHARE_PATH . '/' . $fileName;
            
            return $this->sendResponse([
                'success' => true,
                'src' => $fileUrl,
                'share_url' => $this->prepareShareUrl($type, $fileUrl)
            ]);

        } catch (\Exception $ex) {
            return $this->sendError(__('Error') . ': ' . $ex->getMessage());
        }
    }
    
    protected function prepareShareUrl($type, $fileUrl) {
        switch ($type) {
            case 'facebook':
                    return $this->prepareShareFbUrl( $fileUrl );
                break;
            
            case 'twitter':
                    return $this->prepareShareTwUrl( $fileUrl );
                break;
            
            case 'pinterest':
                    return $this->prepareSharePnUrl( $fileUrl );
                break;
        }
    }
    
    protected function prepareSharePnUrl ( $fileUrl ) {
        return self::SHARE_PIN_URL . $fileUrl;
    }
    
    protected function prepareShareTwUrl( $fileUrl ) {
        return self::SHARE_TWITTER_URL . $fileUrl;
    }

    protected function prepareShareFbUrl( $fileUrl ) {
        return self::SHARE_FB_URL . $fileUrl;
    }
    
    protected function prepareImgData($img) {
        //decodedData = atob(encodedData);
        $dataEncoded = explode(',', $img);
        return base64_decode($dataEncoded[1]);
    }
    
    protected function sendError($errMessage) {
        return $this->sendResponse([
            'error' => true,
            'errMessage' => $errMessage
        ]);
    }
    
    protected function sendResponse($response = array()) {

        $jsonResponse = $this->resultFactory->create(ResultFactory::TYPE_JSON);
        $jsonResponse->setData($response);
        return $jsonResponse;
    }
}
