<?php

require_once 'Dnovae/Hollybyte/Api/Rest.php';

class Dnovae_Hollybyte_Api_Upload extends Dnovae_Hollybyte_Api_Rest {

    protected $url = "https://api.hollybyte.com/upload";

    /**
     *
     */
    function __construct($user, $secret, $account) {
        parent::__construct($user, $secret, $this->url, $account);
    }

    /**
     * @return an array of repo & path
     */
    function upload($filename, $file, $url = NULL) {

        $token = $this -> getOauthToken();
        $acc_tk = $token['access_token'];

        $param = array('oauth_token' => $acc_tk, 'account' => $this->account);
        if(!empty($file)) {
            $param['filename'] = $filename;
            $param['file'] = '@' . $file;
        }
        if(!empty($url)) {
            $param['filename'] = $filename;
            $param['url'] = $url;
        }

        $this -> curl -> setUrl($this -> url);
        $this -> curl -> setParam($param);
        set_time_limit(0);
        $data = $this -> curl -> postCurl();

        $decode = json_decode($data, TRUE);
        if(isset($decode['error_code'])) {
            return $data;
        } else {
            return $decode['result'];
        }
    }
}