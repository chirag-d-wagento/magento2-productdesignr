<?php

namespace Develodesign\Designer\Helper;

class Library extends \Magento\Framework\App\Helper\AbstractHelper {
    
    
    const DEFAULT_PATH = 'default';
    const LIBRARY_PATH = 'dd_library';
    
    
    protected $_filesystem;
    
    public function __construct(
        \Magento\Framework\App\Helper\Context $context, 
        \Magento\Framework\Filesystem $filesystem
    )
    {
        parent::__construct($context);
        $this->_filesystem = $filesystem;
    }
    
    public function getCategories()
    {
        $out = array();

        $path = $this->getAbsolutePath();
        foreach (new \DirectoryIterator($path) as $fileInfo) {
            if ($fileInfo->isDot()) {
                continue;
            }
            if ($fileInfo->isDir()) {
                $out[] = $fileInfo->getBasename();
            }
        }
            
        return $out;    
                
    }

    protected function getAbsolutePath($lang = null) 
    {
        $reader = $this->_filesystem->getDirectoryRead(\Magento\Framework\App\Filesystem\DirectoryList::MEDIA);
        $path = $reader->getAbsolutePath(self::LIBRARY_PATH . '/' . ($lang ? $lang : self::DEFAULT_PATH));
        return $path;
    }
}
