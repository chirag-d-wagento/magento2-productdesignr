<?php

namespace Develo\Designer\Controller\Index;

class Share extends \Develo\Designer\Controller\Front {

    const SHARE_PATH = 'dd_share';
    
    const SHARE_FB_URL = 'https://facebook.com/share.php?u=';

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
            die();
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

        } catch (Exception $ex) {
            return $this->sendError(__('Error') . ': ' . $ex->getMessage());
        }
    }
    
    protected function prepareShareUrl($type, $fileUrl) {
        switch ($type) {
            case 'facebook':
                    return $this->prepareShareFbUrl( $fileUrl );
                break;
        }
    }

    protected function prepareShareFbUrl( $fileUrl ) {
        return self::SHARE_FB_URL . $fileUrl;
    }
    
    protected function prepareImgData($img) {
        //decodedData = atob(encodedData);
        $dataEncoded = explode(',', $img);
        return base64_decode($dataEncoded[1]);
    }
}
