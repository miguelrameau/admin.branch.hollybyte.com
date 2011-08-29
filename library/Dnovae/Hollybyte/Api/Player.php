<?php

require_once 'Dnovae/Hollybyte/Api/Rest.php';

class Dnovae_Hollybyte_Api_Player extends Dnovae_Hollybyte_Api_Rest {
    
    protected $url = "https://api.hollybyte.com/player";
    
    /**
     *
     */
    function __construct($user, $secret, $account) {
        parent::__construct($user, $secret, $this->url, $account);
    }
    
    /**
     * @return True || False
     */
    function logo($id, $filename) {

        $token = $this->getOauthToken();
        $acc_tk = $token['access_token'];

        $url = $this->url . "/logo/" . $id;
        $param = array("oauth_token" => $acc_tk, "account" => $this->account, "filename" => $filename);

        $this->curl->setParam($param);
        $this->curl->setUrl($url);
        $data = $this->curl->postCurl();

        $decode = json_decode($data, TRUE);
        if(isset($decode['error_code'])) {
            return $data;
        } else {
            return (bool)$decode['result'];
        }
    }
    
    /**
     * @return True || False
     */
    function play($id, $filename) {

        $token = $this->getOauthToken();
        $acc_tk = $token['access_token'];

        $url = $this->url . "/play/" . $id;
        $param = array("oauth_token" => $acc_tk, "account" => $this->account, "filename" => $filename);

        $this->curl->setParam($param);
        $this->curl->setUrl($url);
        $data = $this->curl->postCurl();

        $decode = json_decode($data, TRUE);
        if(isset($decode['error_code'])) {
            return $data;
        } else {
            return (bool)$decode['result'];
        }
    }
}

