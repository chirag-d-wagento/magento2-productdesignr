<?php

ini_set('display_errors', true);

$appSecret = '2241ca3502554b64661017604612b821';
$clientId = '455613418231225';

$cookie = 'o_RFd7zA9ui5PmMslixIi8WSefWvSdHZyTDv-aI94yQ.eyJhbGdvcml0aG0iOiJITUFDLVNIQTI1NiIsImNvZGUiOiJBUUE3ZkFoaTItZjB2YWt6dWlGbFozdWdkdmd5bG9YdExLMkhGSElYenFkRGp3M1BLZDdUdG83MGFwejctQjlRMDI3TFA1bkpCUTdZRXJTbkg4bHU3S0U4dDVGX2J5Y3BJYkhfMGhzM1ZXdVVtcFNxQ0ZTRG9hNS1tejNpbzFicWRqYXpGU1NhZndXN2kyWFRPSVA4cGN2YkhKM0oyOE1UUXRiQ0RMdE01UHpVS2ZaNlFoOHc3NnlGQ244NWdCZ1cyTGVEc2Vza2tSYVEwOF9TdTFEemZVUV9WM2N1bS1HZEFRc200R2RJa2xPaVphOXE2dE9ubnl1MHhNS2pSZVBaeU5pOGR1Nm9xYmx1T1FLNld0WGxfTmdMWEtmQlU5ZVM2M0VtY1BkWTZhQ21ub0RYa1dGNGN4enR5eEYtenZIQlhKME9LOThIQmZrbUVsZEJMOVJqWEw0eCIsImlzc3VlZF9hdCI6MTUyNjUwNzgxMCwidXNlcl9pZCI6IjE2NDk5Njc5MTUwODY2ODcifQ';


//split by .

list($encodedSig, $encodedPayload) = explode('.', $cookie);

$sig = base64UrlDecode($encodedSig);

$hashedSig = hashSignature($encodedPayload, $appSecret);

$valid = validateSignature($hashedSig, $sig);

$payload = decodePayload($encodedPayload);

validateAlgorithm($payload);

getAccessToken($payload['code'], $clientId, $appSecret);

//functions 

function getAccessToken($code, $client_id, $appSecret)
{

    $params = [
        'code' => $code,
        'redirect_uri' => '',
        'client_id' => $client_id, 
        'client_secret' => $appSecret,
        'appsecret_proof' => getAppSecretProof($client_id, $appSecret),
        'access_token' => $client_id . '|' . $appSecret
    ];

    $BASE_GRAPH_URL = 'https://graph.facebook.com';
    $urlPath = '/oauth/access_token';

    $url = appendParamsToUrl($BASE_GRAPH_URL . $urlPath, $params);
    
    $defaultHeaders = [
        'User-Agent' => 'fb-php-5.6.2',
        'Accept-Encoding' => '*'
    ];

    $curl = curl_init();

    $options = [
        CURLOPT_CUSTOMREQUEST => 'GET',
        CURLOPT_HTTPHEADER => compileRequestHeaders($defaultHeaders),
        CURLOPT_URL => $url,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_TIMEOUT => 60,
        CURLOPT_RETURNTRANSFER => true, // Return response as string
        CURLOPT_HEADER => true, // Enable header processing
        CURLOPT_SSL_VERIFYHOST => 2,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_CAINFO => __DIR__ . '/certs/DigiCertHighAssuranceEVRootCA.pem',
        //CURLOPT_POSTFIELDS => $body
    ];

    curl_setopt_array($curl, $options);


    $response = curl_exec($curl);

    echo 'response<hr>';

    var_dump($response);
}

function getAppSecretProof($client_id, $appSecret)
{
    return hash_hmac('sha256', $client_id . '|' . $appSecret, $appSecret);
}

function compileRequestHeaders(array $headers)
{
    $return = [];

    foreach ($headers as $key => $value) {
        $return[] = $key . ': ' . $value;
    }

    return $return;
}

function appendParamsToUrl($url, array $newParams = [])
{
    if (empty($newParams)) {
        return $url;
    }

    if (strpos($url, '?') === false) {
        return $url . '?' . http_build_query($newParams, null, '&');
    }

    list($path, $query) = explode('?', $url, 2);
    $existingParams = [];
    parse_str($query, $existingParams);

    // Favor params from the original URL over $newParams
    $newParams = array_merge($newParams, $existingParams);

    // Sort for a predicable order
    ksort($newParams);

    return $path . '?' . http_build_query($newParams, null, '&');
}

function validateAlgorithm($payload)
{
    if ($payload['algorithm'] !== 'HMAC-SHA256') {
        die('Signed request is using the wrong algorithm.');
    }
}

function base64UrlDecode($input)
{
    $urlDecodedBase64 = strtr($input, '-_', '+/');
    return base64_decode($urlDecodedBase64);
}

function hashSignature($encodedData, $appSecret)
{
    $hashedSig = hash_hmac(
            'sha256', $encodedData, $appSecret, $raw_output = true
    );
    return $hashedSig;
}

function validateSignature($hashedSig, $sig)
{
    if (\hash_equals($hashedSig, $sig)) {
        return true;
    }
    die('invalid signature');
}

function decodePayload($encodedPayload)
{
    $payload = base64UrlDecode($encodedPayload);
    if ($payload) {
        $payload = json_decode($payload, true);
    }
    if (!is_array($payload)) {
        die('Signed request has malformed encoded payload data.');
    }
    return $payload;
}
