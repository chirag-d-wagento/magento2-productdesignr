<?php

namespace Develodesign\Designer\Controller\Adminhtml\Image;

use Magento\Framework\Controller\ResultFactory;

class Upload extends \Magento\Backend\App\Action {

    const ADMIN_UPLOADER_PATH = 'dd_designer';

    protected $_fileUploaderFactory;
    protected $_filesystem;
    protected $_storeManager;

    public function __construct(
        \Magento\Backend\App\Action\Context $context, 
        \Magento\Framework\Filesystem $filesystem, 
        \Magento\Store\Model\StoreManagerInterface $storeManager, 
        \Magento\MediaStorage\Model\File\UploaderFactory $fileUploaderFactory
    ) {
        $this->_fileUploaderFactory = $fileUploaderFactory;
        $this->_filesystem = $filesystem;
        $this->_storeManager = $storeManager;
        parent::__construct($context);
    }

    public function execute() {
        $uploader = $this->_fileUploaderFactory->create(['fileId' => 'file']);
        $uploader->setAllowedExtensions(['jpg', 'jpeg', 'gif', 'png']);
        $uploader->setAllowRenameFiles(true);
        $uploader->setFilesDispersion(false);
        $reader = $this->_filesystem->getDirectoryRead(\Magento\Framework\App\Filesystem\DirectoryList::MEDIA);
        $path = $reader->getAbsolutePath(self::ADMIN_UPLOADER_PATH . '/');
        $save = $uploader->save($path);
        if ($save && !empty($save['file'])) {
            $sizes = getimagesize($path . $save['file']);
            return $this->sendResponse([
                        'success' => true,
                        'width' => $sizes[0],
                        'height' => $sizes[1],
                        'filename' => $this->_storeManager
                                ->getStore()
                                ->getBaseUrl(\Magento\Framework\UrlInterface::URL_TYPE_MEDIA) .
                        self::ADMIN_UPLOADER_PATH . '/' . $save['file']
            ]);
        } else {

            return $this->sendResponse([
                'error' => true,
                'errMessage' => 'ERROR: UPLOADING FILES!'
            ]);
        }
    }

    public function sendResponse($response = array()) {
        $jsonResponse = $this->resultFactory->create(ResultFactory::TYPE_JSON);
        $jsonResponse->setData($response);
        return $jsonResponse;
    }

}
