<?php

namespace Develodesign\Designer\Model;

abstract class AbstractFb
{

    const VERSION = '/v2.8';
    const GRAPH_BASE_URL = 'https://graph.facebook.com';
    const CERTIFICATE = '/certs/DigiCertHighAssuranceEVRootCA.pem';

    protected $_curl;
    protected $_headers = [
        'User-Agent' => 'fb-php-5.6.2',
        'Accept-Encoding' => '*'
    ];
    protected $_url;
    protected $_accessToken;

    public function __construct()
    {
        
    }

    public function setToken($token)
    {
        $this->_accessToken = $token;
    }

    public function getToken()
    {
        return $this->_accessToken;
    }

    protected function call()
    {
        return curl_exec($this->_curl);
    }

    protected function setHeader($key, $val)
    {
        $this->_headers[$key] = $val;
    }

    protected function getHeaders()
    {
        return $this->_headers;
    }

    protected function initCall()
    {
        $this->_curl = curl_init();

        $options = [
            CURLOPT_CUSTOMREQUEST => 'GET',
            CURLOPT_HTTPHEADER => $this->compileRequestHeaders($this->getHeaders()),
            CURLOPT_URL => $this->getUrl(),
            CURLOPT_CONNECTTIMEOUT => 10,
            CURLOPT_TIMEOUT => 60,
            CURLOPT_RETURNTRANSFER => true, // Return response as string
            CURLOPT_HEADER => false, // Enable header processing
            CURLOPT_SSL_VERIFYHOST => 2,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_CAINFO => __DIR__ . self::CERTIFICATE,
                //CURLOPT_POSTFIELDS => $body
        ];
        curl_setopt_array($this->_curl, $options);
    }

    protected function compileRequestHeaders($headers)
    {
        $return = [];

        foreach ($headers as $key => $value) {
            $return[] = $key . ': ' . $value;
        }

        return $return;
    }

    protected function setBaseUrl()
    {
        $this->_url = self::GRAPH_BASE_URL . self::VERSION;
    }

    protected function getUrl()
    {
        return $this->_url;
    }

    protected function appendParamsToUrl(array $newParams = [])
    {
        if (empty($newParams)) {
            return $this->_url;
        }

        if (strpos($this->_url, '?') === false) {
             $this->_url .= '?' . http_build_query($newParams, null, '&');
             return;
        }

        list($path, $query) = explode('?', $this->_url, 2);
        $existingParams = [];
        parse_str($query, $existingParams);

        // Favor params from the original URL over $newParams
        $newParams = array_merge($newParams, $existingParams);

        // Sort for a predicable order
        ksort($newParams);

        $this->_url = $path . '?' . http_build_query($newParams, null, '&');
        
        return $this->_url;
    }

    abstract function prepareUrl(array $params);

    abstract function parseResponse($response);
    
    abstract function doCall();
}
