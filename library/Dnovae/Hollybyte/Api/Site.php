<?php

require_once 'Dnovae/Hollybyte/Api/Rest.php';

class Dnovae_Hollybyte_Api_Site extends Dnovae_Hollybyte_Api_Rest {

    protected $url = "https://api.hollybyte.com/site";

    /**
     *
     */
    function __construct($user, $secret, $account) {
        parent::__construct($user, $secret, $this->url, $account);
    }

    /**
     *
     */
    function sync($id) {
        $token = $this->getOauthToken();
        $acc_tk = $token['access_token'];
        $url = $this->url . "/sync/" . $id . "?oauth_token=" . $acc_tk . "&account=" . $this->account;
        $this->curl->setUrl($url);
        $data = $this->curl->getCurl();
        
        $decode = json_decode($data, TRUE);
        if(isset($decode['error_code'])) {
            return $data;
        } else {
            return $decode['result'];
        }
    }

    /**
     *
     */
    function deploy($id) {
        $token = $this->getOauthToken();
        $acc_tk = $token['access_token'];
        $url = $this->url . "/deploy/" . $id . "?oauth_token=" . $acc_tk . "&account=" . $this->account;
        $this->curl->setUrl($url);
        $data = $this->curl->getCurl();

        $decode = json_decode($data, TRUE);
        if(isset($decode['error_code'])) {
            return $data;
        } else {
            return $decode['result'];
        }
    }

    /**
     *
     */
    function findAssets($id, $assetFields = array()) {
        $token = $this->getOauthToken();
        $acc_tk = $token['access_token'];

        $url = $this->url . "/find-assets/" . $id . "?oauth_token=" . $acc_tk . "&account=" . $this->account;
        if(!empty($assetFields)) {
            $url = '&assetFields=' . json_encode($assetFields);
        }

        $this->curl->setUrl($url);
        $data = $this->curl->getCurl();

        $decode = json_decode($data, TRUE);
        if(isset($decode['error_code'])) {
            return $data;
        } else {
            return $decode['result'];
        }
    }

    /**
     *
     */
    function updateAssets($id, $siteAssets) {
        $token = $this->getOauthToken();
        $acc_tk = $token['access_token'];

        $url = $this->url . "/update-assets/" . $id;

        $param = array("oauth_token" => $acc_tk, "account" => $this->account, "siteAssets" => json_encode($siteAssets));

        $this->curl->setParam($param);
        $this->curl->setUrl($url);
        $data = $this->curl->postCurl();

        $decode = json_decode($data, TRUE);
        if(isset($decode['error_code'])) {
            return $data;
        } else {
            return $decode['result'];
        }
    }

}
