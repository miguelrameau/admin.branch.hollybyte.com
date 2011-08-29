<?php

require_once 'Auth/OpenID/google_discovery.php';
require_once 'Auth/OpenID/AX.php';
require_once 'Auth/OpenID/Consumer.php';
require_once 'Auth/OpenID/FileStore.php';
require_once 'Auth/OpenID/PAPE.php';

class Auth_Adapter_GoogleApps implements Zend_Auth_Adapter_Interface {
    private $_domain = NULL;
    private $_callback = NULL;

    public function __construct($domain, $callback) {
        $this->_domain = $domain;
        $this->_callback = $callback;
    }

    public function authenticate() {
        if(empty($this->_domain)) {
            return new Zend_Auth_Result(Zend_Auth_Result::FAILURE, null, 'Domain is empty');
        }

        $frontController = Zend_Controller_Front::getInstance();
        $request = $frontController->getRequest();
        $openid_mode = $request->getParam('openid_mode', NULL);

        if(empty($openid_mode)) {
            $store = new Auth_OpenID_FileStore(APPLICATION_PATH.'/../tmp');
            $consumer = new Auth_OpenID_Consumer($store);
            new GApps_OpenID_Discovery($consumer);
            $auth = $consumer->begin($this->_domain);

            $attribute = array(Auth_OpenID_AX_AttrInfo::make('http://axschema.org/contact/email', 2, 1, 'email'),
                Auth_OpenID_AX_AttrInfo::make('http://axschema.org/namePerson/first', 1, 1, 'firstname'),
                Auth_OpenID_AX_AttrInfo::make('http://axschema.org/namePerson/last', 1, 1, 'lastname'));

            $ax = new Auth_OpenID_AX_FetchRequest;
            foreach($attribute as $attr) {
                $ax->add($attr);
            }
            $auth->addExtension($ax);

            $BASE_URL = 'https://admin.hollybyte.com';
            $callback = "";
            if (!empty($this->_callback)) {
                $callback .= "&callback=".urlencode($this->_callback);
            }
            $url = $auth->redirectURL($BASE_URL.'/', $BASE_URL.'/auth/market?domain='.$this->_domain.$callback);
            header('Location: '.$url);
        } else {
            $store = new Auth_OpenID_FileStore(APPLICATION_PATH.'/../tmp');
            $consumer = new Auth_OpenID_Consumer($store);
            new GApps_OpenID_Discovery($consumer);

            $BASE_URL = 'https://admin.hollybyte.com';
            $response = $consumer->complete($BASE_URL.'/auth/market');

            if($response->status == Auth_OpenID_SUCCESS) {
                $ax = new Auth_OpenID_AX_FetchResponse();
                $data = $ax->fromSuccessResponse($response)->data;
                $oid = $response->endpoint->claimed_id;

                return new Zend_Auth_Result(Zend_Auth_Result::SUCCESS, $oid, array('domain' => $this->_domain,
                    'options' => $data));
            } else {
                return new Zend_Auth_Result(Zend_Auth_Result::FAILURE, null, 'Error GoogleApss Authentication.');
            }
        }
    }

}
