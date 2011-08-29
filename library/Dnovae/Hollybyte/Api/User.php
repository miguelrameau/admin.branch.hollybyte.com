<?php

require_once 'Dnovae/Hollybyte/Api/Rest.php';

class Dnovae_Hollybyte_Api_User extends Dnovae_Hollybyte_Api_Rest {

    protected $url = "https://api.hollybyte.com/user";

    /**
     *
     */
    function __construct($user, $secret) {
        parent::__construct($user, $secret, $this->url);
    }

    /**
     * @return an id
     */
    function provider($id, $type) {

        $token = $this->getOauthToken();
        $acc_tk = $token['access_token'];

        $url = $this->url."/provider?oauth_token=".$acc_tk."&id=".$id."&type=".$type;

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
     * @return TRUE / FALSE
     */
    function addAccount($id, $account, $rol) {

        $token = $this->getOauthToken();
        $acc_tk = $token['access_token'];

        $url = $this->url."/add-account";
        $param = array("oauth_token" => $acc_tk, "id" => $id, "account" => $account, "rol" => $rol);
        $size = strlen($acc_tk) + strlen($id) + strlen($account) + strlen($rol) + 25;

        $this->curl->setUrl($url);
        $this->curl->setParam($param);
        $data = $this->curl->putCurl($size);

        $decode = json_decode($data, TRUE);
        if(isset($decode['error_code'])) {
            return $data;
        } else {
            return $decode['result'];
        }
    }
}
