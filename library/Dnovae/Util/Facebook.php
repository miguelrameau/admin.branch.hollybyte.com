<?php

/**
 * Class to upload videos to facebook
 * @author Miguel Angel Casanova Morales
 *
 */

require_once ("Facebook/facebook.php");
Facebook::$CURL_OPTS[CURLOPT_CAINFO] = "/mnt/filer/www/vhosts/admin.hollybyte.com/library/Facebook/fb_ca_chain_bundle.crt";

class Dnovae_Util_Facebook {

    private $_appId = NULL;
    private $_appSecret = NULL;
    private $redirectUri = NULL;

    public function __construct() {
        $keys = Zend_Registry::get('keys');
        $this->_appId = $keys->facebook->appid;
        $this->_appSecret = $keys->facebook->secret;
        $this->redirectUri = $keys->facebook->redirecturi;
    }

    public function getCode($connector) {
        if(empty($this->_appId)) {
            die('Fatal Error. The appId has not been initialize.');
        }
        //parametro state sirve para pasar información como el email del usuario
        $url = 'https://graph.facebook.com/oauth/authorize?client_id='.$this->_appId.'&redirect_uri='.$this->redirectUri.'&scope=publish_stream,offline_access,manage_pages&state='.$connector;
        return $url;
    }

    // Return the access token neede to post in the wall.
    public function getAccessToken($code) {
        if(empty($this->_appId)) {
            die('Fatal Error. The appId has not been initialize.');
        }
        $param = 'client_id='.$this->_appId.'&redirect_uri='.$this->redirectUri.'&client_secret='.$this->_appSecret.'&code='.$code;

        $ch = curl_init();
        $url = 'https://graph.facebook.com/oauth/access_token';
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $param);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
        $result = curl_exec($ch);
        curl_close($ch);

        $sub = substr($result, strpos($result, '=') + 1);

        return ($sub);
    }

    public function postVideo($userId, $param) {
        $log = Zend_Registry::get('log');
        $log->info('[Facebook][post]');
        if(empty($this->_appId)) {
            $log->info('[Facebook][post] Fatal Error. The appId has not been initialize.');
            return FALSE;
        }
        $facebook = new Facebook( array('appId' => $this->_appId, 'secret' => $this->_appSecret));
        try {
            $log->info('[Facebook][post] param: '.print_r($param, TRUE));
            $result = $facebook->api('/'.$userId.'/feed', 'post', $param);
            if(empty($result->result[0]['error'])) {
                $log->info('[Facebook][post] OK result: '.print_r($result, TRUE));
                return TRUE;
            } else {
                $log->info('[Facebook][post] result error: '.print_r($result->result[0], TRUE));
                return FALSE;
            }
        } catch (Exception $e) {
            $log->info('[Facebook][post] result: '.print_r($e->result[0], TRUE));
            return $e;
        }
    }

}
