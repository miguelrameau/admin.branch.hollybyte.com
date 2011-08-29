<?php

require_once 'Dnovae/Hollybyte/Api/Rest.php';

class Dnovae_Hollybyte_Api_Asset extends Dnovae_Hollybyte_Api_Rest {

    protected $url = "https://api.hollybyte.com/asset";

    /**
     *
     */
    function __construct($user, $secret, $account) {
        parent::__construct($user, $secret, $this->url, $account);
    }

    /**
     * @return True || False
     */
    function snapshot($id, $second) {

        $token = $this->getOauthToken();
        $acc_tk = $token['access_token'];

        $url = $this->url . "/snapshot/" . $id . "?oauth_token=" . $acc_tk . "&account=" . $this->account . "&second=" . $second;

        $this->curl->setUrl($url);
        $data = $this->curl->getCurl();

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
    function splash($id, $filename) {

        $token = $this->getOauthToken();
        $acc_tk = $token['access_token'];

        $url = $this->url . "/splash/" . $id;
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
    function createFromFile($filename) {

        $token = $this->getOauthToken();
        $acc_tk = $token['access_token'];

        $url = $this->url . "/create-from-file/";
        $param = array("oauth_token" => $acc_tk, "account" => $this->account, "filename" => $filename);

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

    /**
     * @return The id of the uploaded video.
     */
    function uploadYoutube($id, $connector, $category) {

        $token = $this->getOauthToken();
        $acc_tk = $token['access_token'];

        $url = $this->url . "/upload-youtube";
        $param = array('oauth_token' => $acc_tk, "account" => $this->account, "id" => $id, "connector" => $connector, "category" => $category);

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
    
    /**
     * @return True || False
     */
    function subtitle($id, $filename, $type, $lang) {

        $token = $this->getOauthToken();
        $acc_tk = $token['access_token'];

        $url = $this->url . "/subtitle/" . $id;
        $param = array("oauth_token" => $acc_tk, "account" => $this->account, "filename" => $filename, "type" => $type, "lang" => $lang);

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
    function deleteSubtitle($id, $filename) {

        $token = $this->getOauthToken();
        $acc_tk = $token['access_token'];

        $url = $this->url . "/delete-subtitle/" . $id."?oauth_token=".$acc_tk."&account=".$this->account."&filename=".$filename;

        $this->curl->setUrl($url);
        $data = $this->curl->deleteCurl();

        $decode = json_decode($data, TRUE);
        if(isset($decode['error_code'])) {
            return $data;
        } else {
            return (bool)$decode['result'];
        }
    }
}
