<?php

require_once 'Dnovae/Hollybyte/Api/Curl.php';

class Dnovae_Hollybyte_Api_Acl extends Dnovae_Hollybyte_Api_Rest {

    protected $url = "https://api.hollybyte.com/acl";

    /**
    *
    */
    function __construct($user, $secret) {
        parent::__construct($user, $secret, $this->url);
    }

    /**
    * $return True || False
    */
    function allowed($account, $user = NULL, $client = NULL, $resource = NULL, $privilege = NULL) {
        
        $token = $this->getOauthToken();
        $acc_tk = $token['access_token'];
        
        $url = $this->url."/allowed?oauth_token=".$acc_tk."&account=".$account;
        if (!empty ($user)) {
            $url = $url."&user=".$user;
        }
        if (!empty ($client)) {
            $url = $url."&client=".$client;
        }
        if (!empty ($resource)) {
            $url = $url."&resource=".$resource;
        }
        if (!empty ($privilege)) {
            $url = $url."&privilege=".$privilege;
        }
        
        $this->curl->setUrl($url);
        $data = $this->curl->getCurl();
        
        $decode = json_decode($data, TRUE);
        if (isset ($decode['error_code'])) {
            return $data;
        } else {
            return $decode['result'];            
        }
    }
    
    /**
    *  $return True || False
    */
    function accounts($user = NULL, $client = NULL) {
        
        $token = $this->getOauthToken();
        $acc_tk = $token['access_token'];
        
        $url = $this->url."/accounts?oauth_token=".$acc_tk;
        if (!empty ($user)) {
            $url = $url."&user=".$user;
        }
        if (!empty ($client)) {
            $url = $url."&client=".$client;
        }
        
        $log = Zend_Registry::get('log');
        $log->info('URL'.$url);
        $this->curl->setUrl($url);
        $data = $this->curl->getCurl();
        
        $decode = json_decode($data, TRUE);
        if (isset ($decode['error_code'])) {
            return $data;
        } else {
            return $decode['result'];
        }
    }
    
}

