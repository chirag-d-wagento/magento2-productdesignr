<?php

namespace Develodesign\Designer\Controller\Index;

use Magento\Framework\Controller\ResultFactory;

class Facebook extends \Magento\Framework\App\Action\Action
{
    protected $_facebookImages;
    protected $_facebookImage;
    
    protected $_facebookAlbums;
    
    public function __construct(
        \Magento\Framework\App\Action\Context $context, 
        \Develodesign\Designer\Model\Fb\ImagesFb $facebookImages,
        \Develodesign\Designer\Model\Fb\ImageFb $facebookImage,
        \Develodesign\Designer\Model\Fb\AlbumsFb $facebookAlbums
    )
    {
        parent::__construct($context);
       
        $this->_facebookImages = $facebookImages;
        $this->_facebookImage = $facebookImage;
        $this->_facebookAlbums = $facebookAlbums;
    }
    
    public function execute() {
        $token  = $this->getRequest()->getParam('token');
        $this->_facebookAlbums->setToken($token);
        $this->_facebookImages->setToken($token);
        $this->_facebookImage->setToken($token);
        
        $images = $this->getAllImages();
        
        $jsonResponse = $this->resultFactory->create(ResultFactory::TYPE_JSON);
        $jsonResponse->setData($images);
        return $jsonResponse;
    }
    
    protected function getAllImages()
    {
        $albums = $this->getAlbums();
        $output = [];
        $c = 1;
        if(is_object($albums) && !empty($albums) && !empty($albums->data)){
            
            foreach($albums->data as $albumObj){
                
                $imagesObject = $this->getImages($albumObj);
                
                if(!is_object($imagesObject) 
                        || empty($imagesObject) 
                        || empty($imagesObject->data)){
                    continue;
                }
                
                foreach($imagesObject->data as $image) {
                    $this->_facebookImage->setImageId($image->id);
                    $image = $this->_facebookImage->doCall();
                    
                    $output[] = [
                        'width' => $image->width,
                        'height' => $image->height,
                        'src' => $image->source,
                        'name' => 'facebook_image_' . $c . '.jpg'
                    ];
                    
                    $c++;
                }
                
                return $output;
            }
            
        }else{
            //todo exception handling
            return [];
        }
        
        return [];
    }
    
    protected function getImages($albumObj)
    {
        $this->_facebookImages->setAlbumId($albumObj->id);
        return $this->_facebookImages->doCall();
                
    }

    protected function getAlbums()
    {
        return $this->_facebookAlbums->doCall();
    }
}
