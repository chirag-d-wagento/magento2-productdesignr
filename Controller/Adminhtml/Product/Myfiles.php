<?php


namespace Develodesign\Designer\Controller\Adminhtml\Product;

use Magento\Framework\Controller\ResultFactory;

class Myfiles extends \Magento\Backend\App\Action {

    protected $_filesystem;
    protected $_storeManager;

    public function __construct(
    \Magento\Backend\App\Action\Context $context, \Magento\Store\Model\StoreManagerInterface $storeManager, \Magento\Framework\Filesystem $filesystem
    ) {
        parent::__construct($context);
        $this->_filesystem = $filesystem;
        $this->_storeManager = $storeManager;
    }

    public function execute() {
        $files = [];
        $reader = $this->_filesystem->getDirectoryRead(\Magento\Framework\App\Filesystem\DirectoryList::MEDIA);
        $path = $reader->getAbsolutePath(\Develodesign\Designer\Controller\Adminhtml\Image\Upload::ADMIN_UPLOADER_PATH . '/');
        
        foreach (new \DirectoryIterator($path) as $fileInfo) {
            if ($fileInfo->isDot()) {
                continue;
            }
            $sizes = getimagesize($path . $fileInfo->getFilename());
            if ($sizes && !empty($sizes[0])) {
                $files[] = [
                    'src' => $this->_storeManager
                            ->getStore()
                            ->getBaseUrl(\Magento\Framework\UrlInterface::URL_TYPE_MEDIA) .
                    \Develodesign\Designer\Controller\Adminhtml\Image\Upload::ADMIN_UPLOADER_PATH . '/' . $fileInfo->getFilename(),
                    'width' => $sizes[0],
                    'height' => $sizes[1],
                ];
                
            }
}
        
        return $this->sendResponse($files);
    }

    public function sendResponse($response = array()) {
        $jsonResponse = $this->resultFactory->create(ResultFactory::TYPE_JSON);
        $jsonResponse->setData($response);
        return $jsonResponse;
    }

}
