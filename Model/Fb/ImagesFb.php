<?php

namespace Develodesign\Designer\Model\Fb;

class ImagesFb extends \Develodesign\Designer\Model\AbstractFb
{
    const PHOTOS = 'photos';
    
    protected $_albumId;


    public function doCall()
    {
        $this->prepareUrl([
            'format' => 'json',
            'fields' => 'id'
        ]);
        $this->initCall();
        $response = $this->call();
        /*
        if ($errno = curl_errno($this->_curl)) {
            $error_message = curl_strerror($errno);
            echo "cURL error ({$errno}):\n {$error_message}";
        }
         * 
         */
        return $this->parseResponse($response);
        
    }
    
    public function setAlbumId($id)
    {
        $this->_albumId = $id;
    }
    
    public function getAlbumId()
    {
        return $this->_albumId;
    }

    public function prepareUrl(array $params)
    {
        $this->setBaseUrl();
        $this->_url .= '/' . $this->getAlbumId() . '/' . self::PHOTOS;
        $params['access_token'] = $this->getToken();
        $this->appendParamsToUrl($params);
    }
    
    public function parseResponse($response)
    {
        return json_decode($response);
    }

}
