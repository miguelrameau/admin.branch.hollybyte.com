<?php

require_once ("Twitter/Twitteroauth.php");

class Dnovae_Util_Twitter {

    private $_appid = NULL;
    private $_app_secret = NULL;
    private $_googleKey = NULL;
    private $_redirect = NULL;

    public function __construct() {
        $keys = Zend_Registry::get('keys');
        $this->_appid = $keys->twitter->appid;
        $this->_app_secret = $keys->twitter->secret;
        $this->_redirect = $keys->twitter->redirecturi;
        $this->_googleKey = $keys->shorter->appid;
    }

    public function register() {
        $oauth = new TwitterOAuth($this->_appid, $this->_app_secret);
        $request = $oauth->getRequestToken($this->_redirect);
        $ns = new Zend_Session_Namespace('Default');
        $ns->requestToken = $request['oauth_token'];
        $ns->requestTokenSecret = $request['oauth_token_secret'];
        $registerURL = $oauth->getAuthorizeURL($request);
        return $registerURL;
    }

    public function callback($oauth_token) {

        $ns = new Zend_Session_Namespace('Default');
        $oauth_token_secret = $ns->requestTokenSecret;

        $oauth = new TwitterOAuth($this->_appid, $this->_app_secret, $oauth_token, $oauth_token_secret);
        $request = $oauth->getAccessToken();

        return $request;
    }

    /**
     * Publish a new twit.
     * @param string $acc_tk
     * @param string $acc_tk_secret
     * @param string $msg
     */
    public function newStatus($acc_tk, $acc_tk_secret, $msg) {
        $oauth = new TwitterOAuth($this->_appid, $this->_app_secret, $acc_tk, $acc_tk_secret);
        $response = $oauth->post('statuses/update', array('status' => $msg));

        return ( array('user' => $response->user->screen_name, 'text' => $response->text));
    }

    /**
     * Get the screen name of a suer
     * @param string $acc_tk
     * @param string $acc_tk_secret
     */
    public function getScreenName($acc_tk, $acc_tk_secret) {
        $oauth = new TwitterOAuth($this->_appid, $this->_app_secret, $acc_tk, $acc_tk_secret);
        $credentials = $oauth->get('account/verify_credentials');
        $name = $credentials->screen_name;
        return $name;
    }

    /**
     *
     */
    public function shorterUrl($link) {

        $url = "https://www.googleapis.com/urlshortener/v1/url";
        $data = json_encode(array('longUrl' => $link, 'key' => $this->_googleKey));

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-type:application/json'));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $request = curl_exec($ch);
        curl_close($ch);

        $response = json_decode($request, TRUE);
        
        return $response;
    }

}
