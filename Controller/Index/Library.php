<?php

namespace Develo\Designer\Controller\Index;

class Library extends \Develo\Designer\Controller\Front {

    const DEFAULT_PATH = 'default';
    const LIBRARY_PATH = 'dd_library';

    protected $_filesystem;
    protected $_storeManager;

    public function __construct(
    \Magento\Framework\App\Action\Context $context, \Magento\Framework\Filesystem $filesystem, \Magento\Store\Model\StoreManagerInterface $storeManager
    ) {
        parent::__construct($context);
        $this->_filesystem = $filesystem;
        $this->_storeManager = $storeManager;
    }

    public function execute() {
        $out = [];
        try {
            $path = $this->getPath();
            foreach (new \DirectoryIterator($path) as $fileInfo) {
                if ($fileInfo->isDot()) {
                    continue;
                }
                if ($fileInfo->isDir()) {
                    $out[] = [
                        'directory' => true,
                        'name' => $fileInfo->getBasename()
                    ];
                }
                if ($fileInfo->isFile()) {

                    $file = $path . '/' . $fileInfo->getFilename();
                    $sizes = $this->getImgSizes($file);

                    $out[] = [
                        'width' => $sizes['width'],
                        'height' => $sizes['height'],
                        'file' => true,
                        'name' => $fileInfo->getBasename(),
                        'src' => $this->_storeManager
                                ->getStore()
                                ->getBaseUrl(\Magento\Framework\UrlInterface::URL_TYPE_MEDIA) .
                        $this->_path . '/' . $fileInfo->getBasename()
                    ];
                }
            }

            return $this->sendResponse([
                        'success' => true,
                        'data' => $out
            ]);
        } catch (Exception $ex) {
            return $this->sendError(__('Error') . ': ' . $ex->getMessage());
        }
    }

    protected function getImgSizes($file) {
        $path_parts = pathinfo($file);
        if ($path_parts['extension'] != 'svg') {
            $sizes = getimagesize($file);
            return [
                'width' => !empty($sizes[0]) ? $sizes[0] : 0,
                'height' => !empty($sizes[1]) ? $sizes[1] : 0
            ];
        }

        return $this->getSvgFileSize($file);
    }

    protected function getSvgFileSize($file) {
        $svgfile = simplexml_load_file($file);
        return [
            'width' => substr($svgfile['width'], 0, -2),
            'height' => substr($svgfile['height'], 0, -2)
        ];
    }

    protected function getPath() {
        $lang = $this->getRequest()->getParam('lang');
        $lang = preg_replace("/[^a-zA-Z-_]/", "", $lang);

        $reader = $this->_filesystem->getDirectoryRead(\Magento\Framework\App\Filesystem\DirectoryList::MEDIA);
        $path = $reader->getAbsolutePath(self::LIBRARY_PATH . '/' . ($lang ? $lang : self::DEFAULT_PATH));
        $this->_path = self::LIBRARY_PATH . '/' . ($lang ? $lang : self::DEFAULT_PATH);
        if (!is_dir($path) || !file_exists($path)) {
            $path = $reader->getAbsolutePath(self::LIBRARY_PATH . '/' . self::DEFAULT_PATH);
            $this->_path = self::LIBRARY_PATH . '/' . self::DEFAULT_PATH;
        }


        return $this->addCategoryPath($path);
    }

    protected function addCategoryPath($path) {
        $category = $this->getRequest()->getParam('category');
        $category = str_replace(['.', ',', '/', '\\'], ['', '', '', ''], $category);
        if (!$category) {
            return $path;
        }
        $reader = $this->_filesystem->getDirectoryRead(\Magento\Framework\App\Filesystem\DirectoryList::MEDIA);
        $_pathCategory = $reader->getAbsolutePath($this->_path . '/' . $category);
        if (!is_dir($path) || !file_exists($path)) {
            return $path;
        }

        $this->_path = $this->_path . '/' . $category;
        return $_pathCategory;
    }

}
