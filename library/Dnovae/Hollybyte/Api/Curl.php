<?php

class Dnovae_Hollybyte_Api_Curl {

    private $url = NULL;
    private $param = NULL;
    private $token = NULL;

    /**
     * 
     */
    public function __construct($url =NULL, $param =NULL) {
        if(!empty($url)) {
            $this->url = $url;
        }
        if(!empty($param)) {
            $this->param = $param;
        }
    }

    /**
     * Send data by HTTP GET Protocol
     */
    public function getCurl() {

        $ch = curl_init($this->url);
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $request = curl_exec($ch);
        curl_close($ch);

        return $request;
    }

    /**
     * Send data by HTTP POST Protocol
     */
    public function postCurl() {

        $ch = curl_init($this->url);
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $this->param);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $request = curl_exec($ch);
        curl_close($ch);

        return $request;
    }

    /**
     * Send data by HTTP PUT Protocol
     * @param $size : the size of data to send.
     */
    public function putCurl($size) {

        $ch = curl_init($this->url);
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Lenght: '.$size));
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($this->param));
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $request = curl_exec($ch);
        curl_close($ch);

        return $request;
    }

    /**
     * Send data by HTTP DELETE Protocol
     */
    public function deleteCurl() {

        $ch = curl_init($this->url);
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $request = curl_exec($ch);
        curl_close($ch);

        return $request;
    }

    /**
     * Get a valid access token.
     * @return a valid access token.
     */
    public function accessToken($id, $secret) {
        
        $url = 'https://api.hollybyte.com/oauth/token?grant_type=client_credentials&client_id='.$id.'&client_secret='.$secret;

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $request = curl_exec($ch);
        curl_close($ch);

        $token = json_decode($request, TRUE);
        return $token['access_token'];
    }

    /**
     * Get a valid  token.
     * @return a valid  token.
     */
    public function oauthToken($clientId, $secret) {
        $url = 'https://api.hollybyte.com/oauth/token?grant_type=client_credentials&client_id='.$clientId.'&client_secret='.$secret;
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $request = curl_exec($ch);
        curl_close($ch);

        $token = json_decode($request, TRUE);
        $token['expires'] = time() + $token['expires_in'];
        return $token;
    }

    /**
     * Set Url
     * @param $url : a valid url
     */
    public function setUrl($url) {
        $this->url = $url;
    }

    /**
     * Set Param
     * @param $param : Array of params
     */
    public function setParam($param) {
        $this->param = $param;
    }
}
