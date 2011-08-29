<?php

require_once 'BaseController.php';
require_once 'auth/adapter/GoogleApps.php';

class AuthController extends BaseController {

    protected $_keys;

    /**
     *
     */
    public function init() {
        $this->_log = Zend_Registry::get('log');
        $this->_keys = Zend_Registry::get('keys');
        $this->_helper->layout()->disableLayout();
        $this->_helper->layout()->setLayout('anonymous');
        $this->view->staticRepo = "https://hollybyte.s3.amazonaws.com/sites/admin";
    }

    /**
     *
     */
    public function indexAction() {
    }

    /**
     *
     */
    public function loginAction() {
        $this->_log->info('[AuthController][loginAction]');
        // get an instace of Zend_Auth
        $auth = Zend_Auth::getInstance();

        // check if a user is already logged
        if ($auth->hasIdentity()) {
            $this->_log->info('[AuthController][loginAction] hasIdentity');
            return $this->_redirect('/index/index');
        }

        // if the user is not logged, the do the logging
        // $openid_identifier will be set when users 'clicks' on the account provider
        $openid_identifier = $this->getRequest()->getParam('openid_identifier', NULL);
        $this->_log->info('[AuthController][loginAction] openid_identifier: '.$openid_identifier);

        // $openid_mode will be set after first query to the openid provider
        $openid_mode = $this->getRequest()->getParam('openid_mode', NULL);
        $this->_log->info('[AuthController][loginAction] openid_mode: '.$openid_mode);

        // this one will be set by facebook connect
        $code = $this->getRequest()->getParam('code', NULL);
        $this->_log->info('[AuthController][loginAction] code: '.$code);

        // while this one will be set by twitter
        $oauth_token = $this->getRequest()->getParam('oauth_token', NULL);
        $this->_log->info('[AuthController][loginAction] oauth_token: '.$oauth_token);

        //$toFetch = array('country' => true, 'email' => true, 'firstName' => true, 'language' => true, 'lastName' => true, 'gender' => true, 'fullName' => true);

        // do the first query to an authentication provider
        if ($openid_identifier) {

            if ('https://www.twitter.com' == $openid_identifier) {
                $this->_log->info('[AuthController][loginAction] twitter adapter');
                $adapter = $this->_getTwitterAdapter();
            } else if ('https://www.facebook.com' == $openid_identifier) {
                $this->_log->info('[AuthController][loginAction] facebook adapter');
                $adapter = $this->_getFacebookAdapter();
            } else {
                $this->_log->info('[AuthController][loginAction] openid adapter');
                // for openid
                $adapter = $this->_getOpenIdAdapter($openid_identifier);

                // specify what to grab from the provider and what extension to use
                // for this purpose
                $toFetch = $this->_keys->openid->tofetch->toArray();

                // for google and yahoo use AtributeExchange Extension
                if ('https://www.google.com/accounts/o8/id' == $openid_identifier || 'http://me.yahoo.com/' == $openid_identifier) {
                    $ext = $this->_getOpenIdExt('ax', $toFetch);
                } else {
                    $ext = $this->_getOpenIdExt('sreg', $toFetch);
                }

                $adapter->setExtensions($ext);
            }

            // here a user is redirect to the provider for loging
            $this->_log->info('[AuthController][loginAction] authenticate');
            $result = $auth->authenticate($adapter);

            // the following two lines should never be executed unless the redirection faild.
            // $this->_helper->FlashMessenger('Redirection faild');
            $this->_log->info('[AuthController][loginAction] Redirection faild'.print_r($result, true));
            return $this->_redirect('/index/index');
        } else if ($openid_mode || $code || $oauth_token) {
            // this will be exectued after provider redirected the user back to us

            if ($code) {
                // for facebook
                $adapter = $this->_getFacebookAdapter();
            } else if ($oauth_token) {
                // for twitter
                $adapter = $this->_getTwitterAdapter()->setQueryData($_GET);
            } else {
                // for openid
                $adapter = $this->_getOpenIdAdapter(null);

                // specify what to grab from the provider and what extension to use
                // for this purpose
                $ext = null;

                $toFetch = $this->_keys->openid->tofetch->toArray();

                // for google and yahoo use AtributeExchange Extension
                if (isset($_GET['openid_ns_ext1']) || isset($_GET['openid_ns_ax'])) {
                    $ext = $this->_getOpenIdExt('ax', $toFetch);
                } else if (isset($_GET['openid_ns_sreg'])) {
                    $ext = $this->_getOpenIdExt('sreg', $toFetch);
                }

                $this->_log->info('[AuthController][loginAction] Ext: '.print_r($ext, TRUE));
                $this->_log->info('[AuthController][loginAction] GET: '.print_r($_GET, TRUE));
                if ($ext) {
                    $ext->parseResponse($_GET);
                    $adapter->setExtensions($ext);
                }
            }

            $result = $auth->authenticate($adapter);
            $this->_log->info('[AuthController][loginAction] Result: '.print_r($result, TRUE));

            if ($result->isValid()) {
                $this->_log->info('[AuthController][loginAction] isValid');
                $identity = $auth->getIdentity();
                $toStore = array('identity' => $auth->getIdentity());

                if ($ext) {
                    if (strstr($identity, 'openid.hollybyte.com') !== FALSE) {
                        $toStore['provider'] = 'HOLLYBYTE';
                    } else {
                        $toStore['provider'] = 'GOOGLE';
                    }

                    // for openId
                    $toStore['properties'] = $ext->getProperties();
                } else if ($code) {
                    // for facebook
                    $toStore['provider'] = 'FACEBOOK';
                    $msgs = $result->getMessages();
                    $toStore['properties'] = (array)$msgs['user'];
                } else if ($oauth_token) {
                    // for twitter
                    $identity = $result->getIdentity();
                    // get user info
                    $twitterUserData = (array)$adapter->verifyCredentials();
                    $toStore = array('identity' => $identity['user_id']);
                    $toStore['provider'] = 'TWITTER';
                    if (isset($twitterUserData['status'])) {
                        $twitterUserData['status'] = (array)$twitterUserData['status'];
                    }
                    $toStore['properties'] = $twitterUserData;
                }

                $auth->getStorage()->write($toStore);

                // $this->_helper->FlashMessenger('Successful authentication');
                return $this->_redirect('/index/index');
            } else {
                $this->_log->info('[AuthController][loginAction] Not isValid');
                // $this->_helper->FlashMessenger('Failed authentication');
                // $this->_helper->FlashMessenger($result->getMessages());
                return $this->_redirect('/index/index');
            }
        }
    }

    /**
     *
     */
    public function logoutAction() {
        $this->_log->info('[AuthController][logoutAction]');
        $auth = Zend_Auth::getInstance();
        $auth->clearIdentity();
        Zend_Session::forgetMe();
        Zend_Session::destroy();
        return $this->_redirect('/auth/login');
    }

    /**
     *
     */
    public function registryAction() {
        $this->_log->info('[AuthController][registryAction]');

        $obj = new stdClass();

        $auth = Zend_Auth::getInstance();
        if ($auth->hasIdentity()) {
            $identity = $auth->getIdentity();
            $this->_log->info('[AuthController][registryAction] hasIdentity'.print_r($identity, true));
            if ($identity['provider'] == 'GOOGLE') {
                $obj->identity = $identity['identity'];
                $obj->provider = $identity['provider'];
                if (isset($identity['properties']['firstName'])) {
                    $obj->name = $identity['properties']['firstName'];
                }
                if (isset($identity['properties']['lastName'])) {
                    $obj->name .= " ".$identity['properties']['lastName'];
                }
                if (isset($identity['properties']['fullName'])) {
                    $obj->name = " ".$identity['properties']['fullName'];
                }
                if (isset($identity['properties']['email'])) {
                    $obj->email = $identity['properties']['email'];
                }
            } else if ($identity['provider'] == 'HOLLYBYTE') {
                $obj->identity = $identity['identity'];
                $obj->provider = $identity['provider'];
                if (isset($identity['properties']['fullname'])) {
                    $obj->name = " ".$identity['properties']['fullname'];
                }
                if (isset($identity['properties']['email'])) {
                    $obj->email = $identity['properties']['email'];
                }
            } else if ($identity['provider'] == 'FACEBOOK') {
                $obj->identity = $identity['identity'];
                $obj->provider = $identity['provider'];
                if (isset($identity['properties']['name'])) {
                    $obj->name = $identity['properties']['name'];
                }
                if (isset($identity['properties']['email'])) {
                    $obj->email = $identity['properties']['email'];
                }
            } else if ($identity['provider'] == 'TWITTER') {
                $obj->identity = $identity['identity'];
                $obj->provider = $identity['provider'];
                if (isset($identity['properties']['name'])) {
                    $obj->name = $identity['properties']['name'];
                }
            }
        } else {
            $this->_log->info('[AuthController][registryAction] Not has Identity');
            $obj->type = 'FREE';
        }

        $this->view->headScript()->appendFile('/js/flowplayer-3.2.6.min.js');
        $this->view->headScript()->appendFile('/js/jquery/jquery.json-2.2.min.js');
        $this->view->headScript()->appendFile('https://ajax.aspnetcdn.com/ajax/jquery.validate/1.8/jquery.validate.min.js');
        $this->view->headScript()->appendFile('/js/Namespace.js');
        $this->view->headScript()->appendFile('/js/common.js');
        $this->view->headScript()->appendFile('/js/registry/registry.js');

        $this->view->registry = $obj;
    }

    /**
     *
     */
    public function registerAction() {
        $this->_log->info('[AuthController][registerAction]');
        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();
        $registry = $this->getRequest()->getParam('registry', NULL);
        if (empty($registry)) {
            echo json_encode(array('result' => false));
            return;
        }
        $registry = json_decode($registry);
        $this->_log->info('[AuthController][registerAction] Registry: '.print_r($registry, TRUE));

        if (isset($registry->identity) && !empty($registry->identity)) {

            $auth = Zend_Auth::getInstance();
            if (!$auth->hasIdentity()) {
                // TODO Error
            }

            // TODO Valid Auth Identity With Registry
            $identity = $auth->getIdentity();
            $this->_log->info('[AuthController][registerAction] Identity: '.print_r($identity, TRUE));
            $authIdentity = $identity['identity'];
            if ($registry->identity != $authIdentity) {
                // TODO Error
            }

            $user = new stdClass();
            $user->name = $registry->name;
            $user->email = $registry->email;
            $user->providers = array();
            $user->providers[0]->identity = $authIdentity;
            $user->providers[0]->provider = $registry->provider;
            $user->providers[0]->properties = $identity['properties'];
            $this->_log->info('[AuthController][registerAction] User: '.print_r($user, TRUE));
            $userService = Dnovae_Hollybyte_Admin_Registry::getUserService();
            $user = $userService->create($user);
            $this->_log->info('[AuthController][registerAction] User: '.print_r($user, TRUE));

            if (!isset($registry->adduser) || !$registry->adduser) {
                $account = new stdClass();
                $account->id = $registry->account;
                $account->type = $registry->type;
                $account->region = $registry->region;
                $account->gapps = $registry->gapps;
                $account->user = $user['id'];
                $this->_log->info('[AuthController][registerAction] Account: '.print_r($account, TRUE));
                $accountService = Dnovae_Hollybyte_Admin_Registry::getAccountService();
                $account = $accountService->create($account);
                $this->_log->info('[AuthController][registerAction] Account: '.print_r($account, TRUE));
            } else {
                $userService->addAccount($user['id'], $registry->account, 'manager');
            }
        } else {
            $this->_log->info('[AuthController][registerAction] Hollybyte Provider');
            $user = new stdClass();
            $user->name = $registry->name;
            $user->email = $registry->email;
            $user->providers = array();
            $user->providers[0]->identity = 'https://openid.hollybyte.com/user/'.$registry->username;
            $user->providers[0]->provider = 'HOLLYBYTE';
            $user->providers[0]->properties = array(
                    'email' => $registry->email,
                    'fullname' => $registry->name
            );
            $this->_log->info('[AuthController][registerAction] User: '.print_r($user, TRUE));
            $userService = Dnovae_Hollybyte_Admin_Registry::getUserService();
            $user = $userService->create($user);
            $this->_log->info('[AuthController][registerAction] User: '.print_r($user, TRUE));

            $account = new stdClass();
            $account->id = $registry->account;
            $account->type = $registry->type;
            $account->region = $registry->region;
            $account->user = $user['id'];
            $this->_log->info('[AuthController][registerAction] Account: '.print_r($account, TRUE));
            $accountService = Dnovae_Hollybyte_Admin_Registry::getAccountService();
            $account = $accountService->create($account);
            $this->_log->info('[AuthController][registerAction] Account: '.print_r($account, TRUE));

            $filename = "/mnt/filer/sites/openid.hollybyte.com/identities/".$registry->username.".identity";
            $contents = 'identity="https://openid.hollybyte.com/user/'.$registry->username.'"'."\n";
            $contents .= 'pass="'.md5($registry->password).'"'."\n";
            $contents .= 'administrator=0'."\n";
            $contents .= '[sreg]'."\n";
            //            $contents .= 'nickname="Nickname"'."\n";
            $contents .= 'email="'.$registry->email.'"'."\n";
            $contents .= 'fullname="'.$registry->name.'"'."\n";
            //            $contents .= 'dob="1970-01-01"'."\n";
            $contents .= 'gender="'.$registry->gender.'"'."\n";
            //            $contents .= 'postcode="28000"'."\n";
            $contents .= 'country="'.$registry->country.'"'."\n";
            $contents .= 'language="'.$registry->language.'"'."\n";
            //            $contents .= 'timezone=""'."\n";
            file_put_contents($filename, $contents);
        }
        echo json_encode(array('result' => true));
    }

    /**
     *
     */
    public function marketAction() {
        $this->_helper->viewRenderer->setNoRender();
        $this->_log->info('[AuthController][marketAction]');
        $domain = $this->getRequest()->getParam('domain', NULL);
        $this->_log->info('[AuthController][marketAction] domain: '.$domain);
        $callback = $this->getRequest()->getParam('callback', NULL);
        $this->_log->info('[AuthController][marketAction] callback: '.$callback);

        if (empty($domain)) {
            $this->_redirect("/auth/login");
        }

        $auth = Zend_Auth::getInstance();
        $adapter = $this->_getGoogleAppsAdapter($domain, $callback);
        $result = $auth->authenticate($adapter);
        $this->_log->info('[AuthController][marketAction] Result: '.print_r($result, TRUE));

        if ($result->isValid()) {

            $identity = $result->getIdentity();
            $messages = $result->getMessages();
            $domain = $messages['domain'];
            $data = $messages['options'];
            $fullname = $data['http://axschema.org/namePerson/first'][0];
            $fullname .= " ".$data['http://axschema.org/namePerson/last'][0];
            $email = $data['http://axschema.org/contact/email'][0];
            $properties = array(
                    'fullname' => $fullname,
                    'email' => $email
            );

            $toStore = array('identity' => $identity);
            $toStore['provider'] = 'GOOGLE_APPS';
            $toStore['domain'] = $domain;
            $toStore['properties'] = $properties;

            $accountService = Dnovae_Hollybyte_Admin_Registry::getAccountService();
            $accounts = $accountService->find(array('gapps' => $domain));
            if (!empty($accounts)) {
                $account = $accounts[0];

                $userService = Dnovae_Hollybyte_Admin_Registry::getUserService();
                $users = $userService->find(array('email' => $email));
                if (!empty($users)) {
                    $user = $users[0];
                    $this->_log->info('[AuthController][marketAction] Exist User: '.print_r($user, TRUE));
                    $aclService = Dnovae_Hollybyte_Admin_Registry::getAcl();
                    $accs = $aclService->accounts($user['id']);
                    if (!in_array($account['id'], $accs)) {
                        $userService->addAccount($user['id'], $account['id'], 'manager');
                    }
                } else {
                    $user = new stdClass();
                    $user->name = $fullname;
                    $user->email = $email;
                    $user->providers = array();
                    $user->providers[0]->identity = $identity;
                    $user->providers[0]->provider = 'GOOGLE_APPS';
                    $user->providers[0]->domain = $domain;
                    $user->providers[0]->properties = $properties;
                    $this->_log->info('[AuthController][marketAction] Create User: '.print_r($user, TRUE));
                    $userService = Dnovae_Hollybyte_Admin_Registry::getUserService();
                    $user = $userService->create($user);
                    $this->_log->info('[AuthController][marketAction] Created User: '.print_r($user, TRUE));
                    $userService->addAccount($user['id'], $account['id'], 'manager');
                }
                $auth->getStorage()->write($toStore);
                $ns = new Zend_Session_Namespace('Default');
                unset($ns->user);
                $this->_redirect("/home");
            }

            $userService = Dnovae_Hollybyte_Admin_Registry::getUserService();
            $userId = $userService->provider($identity, 'GOOGLE_APPS');
            $this->_log->info('[AuthController][marketAction] User: '.print_r($userId, TRUE));
            if ($userId != NULL) {
                if (!$auth->hasIdentity() || !is_array($auth->getIdentity())) {
                    $this->_log->info('[AuthController][marketAction] Auth Not Has Identity: '.print_r($userId, TRUE));
                    $auth->getStorage()->write($toStore);
                } else {
                    $this->_log->info('[AuthController][marketAction] Auth Identity: '.print_r($auth->getIdentity(), TRUE));
                }
                $this->_redirect("/home");
            }

            $auth->getStorage()->write($toStore);

            $this->_log->info('[AuthController][marketAction] Identity: '.print_r($identity, true));
            $obj = new stdClass();
            $obj->identity = $identity;
            $obj->type = 'FREE';
            $obj->provider = 'GOOGLE_APPS';
            $obj->gapps = $domain;
            $obj->name = $fullname;
            $obj->email = $email;
            $obj->callback = $callback;

            $this->view->headScript()->appendFile('/js/flowplayer-3.2.6.min.js');
            $this->view->headScript()->appendFile('/js/jquery/jquery.json-2.2.min.js');
            $this->view->headScript()->appendFile('https://ajax.aspnetcdn.com/ajax/jquery.validate/1.8/jquery.validate.min.js');
            $this->view->headScript()->appendFile('/js/Namespace.js');
            $this->view->headScript()->appendFile('/js/common.js');
            $this->view->headScript()->appendFile('/js/registry/registry.js');

            $this->view->registry = $obj;
            $this->render('registry');
        } else {
            $this->_redirect("/auth/login");
        }
    }

    /**
     *
     */
    public function existsAccountAction() {
        $this->_log->info('[AuthController][existsAccountAction]');
        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        $result = TRUE;

        $id = $this->getRequest()->getParam('id', NULL);
        $this->_log->info('[AuthController][existsAccountAction] ID: '.$id);
        if (!empty($id)) {
            $accountService = Dnovae_Hollybyte_Admin_Registry::getAccountService();
            if ($accountService->exists($id)) {
                $result = FALSE;
            }
        }
        echo json_encode($result);
    }

    /**
     *
     */
    public function existsUsernameAction() {
        $this->_log->info('[AuthController][existsUsernameAction]');
        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        $result = TRUE;

        $username = $this->getRequest()->getParam('username', NULL);
        $this->_log->info('[AuthController][existsUsernameAction] Username: '.$username);
        if (!empty($username)) {
            $filename = "/mnt/filer/sites/openid.hollybyte.com/identities/$username.identity";
            if (file_exists($filename)) {
                $result = FALSE;
            }
        }
        echo json_encode($result);
    }

    /**
     *
     */
    public function existsEmailAction() {
        $this->_log->info('[AuthController][existsEmailAction]');
        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        $result = TRUE;

        $email = $this->getRequest()->getParam('email', NULL);
        $this->_log->info('[AuthController][existsEmailAction] Email: '.$email);
        if (!empty($email)) {
            $userService = Dnovae_Hollybyte_Admin_Registry::getUserService();
            $data = $userService->find(array('email' => $email));
            if (!empty($data)) {
                $result = FALSE;
            }
        }
        echo json_encode($result);
    }

    /**
     *
     */
    public function autherrorAction() {
    }

    /**
     *
     */
    public function unauthorizedAction() {
        $this->_log->info('[AuthController][unauthorizedAction]');
    }

    /**
     * Get My_Auth_Adapter_Facebook adapter
     *
     * @return My_Auth_Adapter_Facebook
     */
    protected function _getFacebookAdapter() {
        extract($this->_keys->facebook->toArray());
        return new My_Auth_Adapter_Facebook($appid, $secret, $redirecturi, $scope);
    }

    /**
     * Get My_Auth_Adapter_Oauth_Twitter adapter
     *
     * @return My_Auth_Adapter_Oauth_Twitter
     */
    protected function _getTwitterAdapter() {
        extract($this->_keys->twitter->toArray());
        return new My_Auth_Adapter_Oauth_Twitter( array(), $appid, $secret, $redirecturi);
    }

    /**
     * Get Zend_Auth_Adapter_OpenId adapter
     *
     * @param string $openid_identifier
     * @return Zend_Auth_Adapter_OpenId
     */
    protected function _getOpenIdAdapter($openid_identifier = null, $returnTo = null) {
        $adapter = new Zend_Auth_Adapter_OpenId($openid_identifier, null, $returnTo);
        $dir = APPLICATION_PATH.'/../tmp';

        if (!file_exists($dir)) {
            if (!mkdir($dir)) {
                throw new Zend_Exception("Cannot create $dir to store tmp auth data.");
            }
        }
        $adapter->setStorage(new Zend_OpenId_Consumer_Storage_File($dir));

        return $adapter;
    }

    /**
     * Get Zend_OpenId_Extension. Sreg or Ax.
     *
     * @param string $extType Possible values: 'sreg' or 'ax'
     * @param array $propertiesToRequest
     * @return Zend_OpenId_Extension|null
     */
    protected function _getOpenIdExt($extType, array $propertiesToRequest) {

        $ext = null;

        if ('ax' == $extType) {
            $ext = new My_OpenId_Extension_AttributeExchange($propertiesToRequest);
        } elseif ('sreg' == $extType) {
            $ext = new Zend_OpenId_Extension_Sreg($propertiesToRequest);
        }

        return $ext;
    }

    /**
     *
     */
    protected function _getGoogleAppsAdapter($domain, $callback = NULL) {
        return new Auth_Adapter_GoogleApps($domain, $callback);
    }

}
