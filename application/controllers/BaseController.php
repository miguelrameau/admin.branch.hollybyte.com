<?php

require_once 'Dnovae/Hollybyte/Admin/Registry.php';

abstract class BaseController extends Zend_Controller_Action {

    protected $_log;
    protected $_userId;
    protected $_account;
    protected $_resource;
    protected $_service;

    /**
     *
     */
    public function init() {
        $this -> _log = Zend_Registry::get('log');
        $this -> _log -> info('[BaseController][init]');

        $this -> _account = $this -> getCurrentAccountId();
        $this -> _userId = $this -> getUserId();
        $this -> view -> account = $this -> getCurrentAccountId();
        $this -> view -> region = $this -> getCurrentAccountRegion();
        $this -> view -> accounts = $this -> getAccounts();
        $this -> view -> userName = $this -> getUserName();
        $this -> view -> selectedAccount = $this -> _account;
        $this -> view -> currController = $this -> getRequest() -> getControllerName();
        $this -> view -> accountType = $this -> getCurrentAccountType();
        $this -> view -> staticRepo = "https://hollybyte.s3.amazonaws.com/sites/admin";
        $this -> view -> acl = $this -> getAcl();
        
        if($this -> view -> region == 'EU_W1') {
            $this -> view -> repo = 'repo.eu-w1.hollybyte.com';
        } else if($this -> view -> region == 'US_E1') {
            $this -> view -> repo = 'repo.us-e1.hollybyte.com';
        } else if($this -> view -> region == 'US_W1') {
            $this -> view -> repo = 'repo.us-w1.hollybyte.com';
        } else if($this -> view -> region == 'APAC_SE1') {
            $this -> view -> repo = '$this -> view -> region.apac-se1.hollybyte.com';
        } else if($this -> view -> region == 'APAC_NE1') {
            $this -> view -> repo = '$this -> view -> region.apac-ne1.hollybyte.com';
        }else{
            $this -> view -> repo = 'repo.eu-w1.hollybyte.com';
        }
    }

    /**
     *
     */
    public function findAction() {
        $this -> _log -> info('[BaseController][findAction] User: ' . $this -> _userId . ' Account: ' . $this -> _account . ' Resource: ' . $this -> _resource);
        $this -> allowed($this -> _account, $this -> _userId, $this -> _resource, 'read');
        $this -> _helper -> layout -> disableLayout();

        $criteria = $this -> getRequest() -> getParam('criteria', array());

        if(!empty($criteria)) {
            $criteria = json_decode($criteria, TRUE);
        }
        $fields = $this -> getRequest() -> getParam('fields', array());
        if(!empty($fields)) {
            $fields = json_decode($fields, TRUE);
        }
        $sort = $this -> getRequest() -> getParam('sort', array());
        if(!empty($sort)) {
            $sort = json_decode($sort, TRUE);
        }
        $skip = $this -> getRequest() -> getParam('skip', 0);
        $limit = $this -> getRequest() -> getParam('limit', 0);

        $datas = $this -> _service -> find($criteria, $fields, $sort, $skip, $limit);
        $this -> _log -> info('[BaseController][findAction]' . print_r($datas, TRUE));
        $this -> view -> result = array('result' => $datas);
    }

    /**
     *
     */
    public function createAction() {
        $this -> _log -> info('[BaseController][createAction] User: ' . $this -> _userId . ' Account: ' . $this -> _account . ' Resource: ' . $this -> _resource);
        $this -> allowed($this -> _account, $this -> _userId, $this -> _resource, 'create');
        $this -> _helper -> layout -> disableLayout();

        $data = $this -> getRequest() -> getParam('data', array());
        if(!empty($data)) {
            $data = json_decode($data, TRUE);
        }
        $this -> _log -> info('[BaseController][createAction] data: ' . print_r($data, TRUE));
        $this -> view -> result = $this -> _service -> create($data);

        return $this -> view -> result;
    }

    /**
     *
     */
    public function updateAction() {
        $this -> _log -> info('[BaseController][updateAction] User: ' . $this -> _userId . ' Account: ' . $this -> _account . ' Resource: ' . $this -> _resource);
        $this -> allowed($this -> _account, $this -> _userId, $this -> _resource, 'update');
        $this -> _helper -> layout -> disableLayout();

        $data = $this -> getRequest() -> getParam('data', array());
        if(!empty($data)) {
            $data = json_decode($data, TRUE);
        }
        $this -> _log -> info('[BaseController][updateAction] data: ' . print_r($data, TRUE));
        $this -> view -> result = $this -> _service -> update($data['id'], $data);
    }

    /**
     *
     */
    public function deleteAction() {
        $this -> _log -> info('[BaseController][deleteAction] User: ' . $this -> _userId . ' Account: ' . $this -> _account . ' Resource: ' . $this -> _resource);
        $this -> allowed($this -> _account, $this -> _userId, $this -> _resource, 'delete');
        $this -> _helper -> layout -> disableLayout();

        $id = $this -> getRequest() -> getParam('id', NULL);
        $this -> _log -> info('[BaseController][deleteAction] id: ' . $id);
        $this -> view -> result = $this -> _service -> delete($id);

    }

    /**
     *
     */
    public function countAction() {
        $this -> _log -> info('[BaseController][countAction] User: ' . $this -> _userId . ' Account: ' . $this -> _account . ' Resource: ' . $this -> _resource);
        $this -> allowed($this -> _account, $this -> _userId, $this -> _resource, 'read');
        $this -> _helper -> layout -> disableLayout();

        $criteria = $this -> getRequest() -> getParam('criteria', array());
        if(!empty($criteria)) {
            $criteria = json_decode($critera, TRUE);
        }
        $skip = $this -> getRequest() -> getParam('skip', 0);
        $limit = $this -> getRequest() -> getParam('limit', 0);

        $result = $this -> _service -> count($criteria, $skip, $limit);
        $this -> view -> result = array('result' => $result);
    }

    /**
     *
     */
    public function existsAction() {
        $this -> _log -> info('[BaseController][existsAction] User: ' . $this -> _userId . ' Account: ' . $this -> _account . ' Resource: ' . $this -> _resource);
        $this -> allowed($this -> _account, $this -> _userId, $this -> _resource, 'read');
        $this -> _helper -> layout -> disableLayout();

        $id = $this -> getRequest() -> getParam('id', NULL);
        $result = $this -> _service -> exists($id);
        $this -> view -> result = array('result' => $result);
    }

    /**
     *
     */
    public function versionAction() {
        $this -> _log -> info('[BaseController][versionAction] User: ' . $this -> _userId . ' Account: ' . $this -> _account . ' Resource: ' . $this -> _resource);
        $this -> allowed($this -> _account, $this -> _userId, $this -> _resource, 'read');
        $this -> _helper -> layout -> disableLayout();

        $id = $this -> getRequest() -> getParam('id', NULL);
        $result = $this -> _service -> version($id);
        $this -> view -> result = array('result' => $result);
    }

    /**
     *
     */
    protected function authUser() {
        $log = Zend_Registry::get('log');
        $log -> info('[BaseController][authUser]');

        $ns = new Zend_Session_Namespace('Default');
        if(!isset($ns -> user) || $ns -> user == NULL || empty($ns -> user)) {
            $auth = Zend_Auth::getInstance();
            if($auth -> hasIdentity()) {
                $identity = $auth -> getIdentity();
                $log -> info('[BaseController][authUser] Has Identity: ' . print_r($identity, TRUE));

                if(!isset($identity['properties'])) {
                    $log -> info('[BaseController][authUser] Properties Not Found: ');
                    return $this -> _redirect('/auth/logout');
                }

                $id = $identity['identity'];
                $provider = $identity['provider'];

                $log -> info('[BaseController][authUser] identity: ' . print_r($id, TRUE));
                $log -> info('[BaseController][authUser] provider: ' . print_r($provider, TRUE));

                $userService = Dnovae_Hollybyte_Admin_Registry::getUserService();
                $userId = $userService -> provider($id, $provider);
                $log -> info('[BaseController][authUser] User: ' . print_r($userId, TRUE));

                if($userId != NULL) {
                    $log -> info('[BaseController][authUser] User Registred');
                    $ns -> user = $userService -> findById($userId);
                    $log -> info('[BaseController][authUser] User: ' . print_r($ns -> user, TRUE));

                    $aclService = Dnovae_Hollybyte_Admin_Registry::getAcl();
                    $ns -> accounts = $aclService -> accounts($userId);
                    $log -> info('[BaseController][authUser] Accounts: ' . print_r($ns -> accounts, TRUE));
                    $accountService = Dnovae_Hollybyte_Admin_Registry::getAccountService();
                    if(!empty($ns -> accounts)) {
                        $ns -> currentAccount = $accountService -> findById($ns -> accounts[0]);
                    } else {
                        // Ups...
                    }
                    $ns -> resources = array();
                    Zend_Session::rememberMe();
                    return TRUE;
                } else {
                    $log -> info('[BaseController][authUser] User Not Registred');
                    return $this -> _redirect('/auth/registry');
                }
            } else {
                $log -> info('[BaseController][authUser] Not has Identity');
                return $this -> _redirect('/auth/login');
            }
        } else {
            $log -> info('[BaseController][authUser] User Loged');
            return TRUE;
        }
    }

    /**
     *
     */
    protected function allowed($account, $user, $resource = NULL, $privilege = NULL) {
        $log = Zend_Registry::get('log');
        $log -> info('[BaseController][allowed] Account: ' . $account . ' User: ' . $user . ' Resource: ' . $resource . ' Privilege: ' . $privilege);

        $allow = FALSE;
        if($resource != NULL) {
            $res = 'ALL';
        }
        if($privilege != NULL) {
            $pri = 'ALL';
        }
        $resources = $this -> getResources();
        if($account != NULL) {
            if(isset($resources[$account][$res][$pri])) {
                $log -> info('[BaseController][allowed] Found in session');
                $allow = $resources[$account][$res][$pri];
            } else {
                $log -> info('[BaseController][allowed] Not found in session');
                $aclService = Dnovae_Hollybyte_Admin_Registry::getAcl();
                $allow = $aclService -> allowed($account, $user, NULL, $resource, $privilege);
                $resources[$account][$res][$pri] = $allow;
            }
        } else {
            if(isset($resources[$res][$pri])) {
                $log -> info('[BaseController][allowed] Found in session');
                $allow = $resources[$res][$pri];
            } else {
                $log -> info('[BaseController][allowed] Not found in session');
                $aclService = Dnovae_Hollybyte_Admin_Registry::getAcl();
                $allow = $aclService -> allowed($account, $user, NULL, $resource, $privilege);
                $resources[$res][$pri] = $allow;
            }
        }
        $this -> setResources($resources);

        if(!$allow) {
            $log -> info('[BaseController][allowed] Not Allowed');
            return $this -> _redirect('/auth/unauthorized');
        }
        return TRUE;
    }

    /**
     *
     */
    protected function getUserId() {
        $ns = new Zend_Session_Namespace('Default');
        return $ns -> user['id'];
    }

    /**
     *
     */
    protected function getUserName() {
        $ns = new Zend_Session_Namespace('Default');
        return $ns -> user['name'];
    }

    /**
     *
     */
    protected function getUser() {
        $ns = new Zend_Session_Namespace('Default');
        return $ns -> user;
    }

    /**
     *
     */
    protected function getAccounts() {
        $ns = new Zend_Session_Namespace('Default');
        return $ns -> accounts;
    }

    /**
     *
     */
    protected function getCurrentAccountId() {
        $ns = new Zend_Session_Namespace('Default');
        return $ns -> currentAccount['id'];
    }

    /**
     *
     */
    protected function getCurrentAccountRegion() {
        $ns = new Zend_Session_Namespace('Default');
        return $ns -> currentAccount['region'];
    }

    /**
     *
     */
    protected function getCurrentAccountType() {
        $ns = new Zend_Session_Namespace('Default');
        return $ns -> currentAccount['type'];
    }

    /**
     *
     */
    protected function getResources() {
        $ns = new Zend_Session_Namespace('Default');
        if(!isset($ns -> resources)) {
            $ns -> resources = array();
        }
        return $ns -> resources;
    }

    /**
     *
     */
    protected function setResources($resources) {
        $ns = new Zend_Session_Namespace('Default');
        $ns -> resources = $resources;
    }

    /**
     *
     */
    protected function getAcl() {
        $type = $this -> getCurrentAccountType();
        //$type = "corporate";
        $account = $this -> getCurrentAccountId();
        //$account = "test";
        $obj = new stdClass();
        $obj -> admin = false;
        $obj -> resources = Array();

        $settingService = Dnovae_Hollybyte_Admin_Registry::getSettingsService($account);
        $setting = $settingService -> findById($account);

        switch( strtolower($type) ) {
            case "free" :
                if(!empty($setting["defaultSite"])) {
                    $obj -> resources["admin-asset-list-embedicons"] = true;
                }
                $obj -> resources["admin-maxdata"] = 10;
                $obj -> resources["admin-api"] = false;
                $obj -> resources["admin-asset"] = true;
                $obj -> resources["admin-asset-list"] = true;
                $obj -> resources["admin-asset-list-edit"] = true;
                $obj -> resources["admin-asset-list-delete"] = true;
                $obj -> resources["admin-asset-list-max"] = 0;
                $obj -> resources["admin-asset-list-deploy"] = true;

                $obj -> resources["admin-asset-edit"] = true;
                $obj -> resources["admin-asset-edit-tab-general"] = true;
                $obj -> resources["admin-asset-edit-tab-tag"] = true;
                $obj -> resources["admin-asset-edit-btn-save"] = true;

                $obj -> resources["admin-playlist"] = true;
                $obj -> resources["admin-playlist-tab-asset"] = true;
                $obj -> resources["admin-playlist-btn-save"] = true;
                $obj -> resources["admin-playlist-tab-asset-btn-add"] = true;

                $obj -> resources["admin-player"] = true;
                $obj -> resources["admin-player-btn-update"] = true;
                $obj -> resources["admin-player-flash"] = true;
                $obj -> resources["admin-player-flash-branding"] = true;
                $obj -> resources["admin-player-html5"] = true;

                $obj -> resources["admin-process"] = true;

                $obj -> resources["admin-settings"] = true;
                $obj -> resources["admin-settings-btn-general"] = true;

                break;

            case "standard" :
                if(!empty($setting["defaultSite"])) {
                    $obj -> resources["admin-asset-list-embedicons"] = true;
                }
                $obj -> resources["admin-maxdata"] = 50;
                $obj -> resources["admin-api"] = false;

                $obj -> resources["admin-asset"] = true;
                $obj -> resources["admin-asset-list"] = true;
                $obj -> resources["admin-asset-list-edit"] = true;
                $obj -> resources["admin-asset-list-delete"] = true;
                $obj -> resources["admin-asset-list-max"] = 0;

                $obj -> resources["admin-asset-edit"] = true;
                $obj -> resources["admin-asset-edit-tab-general"] = true;
                $obj -> resources["admin-asset-edit-tab-tag"] = true;
                $obj -> resources["admin-asset-edit-btn-save"] = true;

                $obj -> resources["admin-playlist"] = true;
                $obj -> resources["admin-playlist-tab-asset"] = true;
                $obj -> resources["admin-playlist-btn-save"] = true;
                $obj -> resources["admin-playlist-tab-asset-btn-add"] = true;

                $obj -> resources["admin-player"] = true;
                $obj -> resources["admin-player-btn-update"] = true;
                $obj -> resources["admin-player-flash"] = true;
                $obj -> resources["admin-player-flash-branding"] = true;
                $obj -> resources["admin-player-html5"] = true;

                $obj -> resources["admin-process"] = true;

                $obj -> resources["admin-settings"] = true;
                $obj -> resources["admin-settings-btn-general"] = true;
                $obj -> resources["admin-settings-btn-user"] = true;

                break;

            case "premium" :
                $obj -> resources["admin-maxdata"] = 0;
                $obj -> resources["admin-api"] = true;

                $obj -> resources["admin-asset"] = true;
                $obj -> resources["admin-asset-list"] = true;
                $obj -> resources["admin-asset-list-edit"] = true;
                $obj -> resources["admin-asset-list-delete"] = true;
                $obj -> resources["admin-asset-list-max"] = 0;

                $obj -> resources["admin-asset-edit"] = true;
                $obj -> resources["admin-asset-edit-tab-general"] = true;
                $obj -> resources["admin-asset-edit-tab-tag"] = true;
                $obj -> resources["admin-asset-edit-tab-metadata"] = true;
                $obj -> resources["admin-asset-edit-tab-encoding"] = true;
                $obj -> resources["admin-asset-edit-tab-group"] = true;
                $obj -> resources["admin-asset-edit-tab-subtitle"] = true;
                $obj -> resources["admin-asset-edit-tab-youtube"] = true;
                $obj -> resources["admin-asset-edit-btn-save"] = true;

                $obj -> resources["admin-playlist"] = true;
                $obj -> resources["admin-playlist-tab-general"] = true;
                $obj -> resources["admin-playlist-tab-metadata"] = true;
                $obj -> resources["admin-playlist-tab-asset"] = true;
                $obj -> resources["admin-playlist-btn-add"] = true;
                $obj -> resources["admin-playlist-btn-save"] = true;
                $obj -> resources["admin-playlist-btn-delete"] = true;
                $obj -> resources["admin-playlist-tab-asset-btn-add"] = true;

                $obj -> resources["admin-player"] = true;
                $obj -> resources["admin-player-limit"] = 10;
                $obj -> resources["admin-player-add"] = true;
                $obj -> resources["admin-player-btn-update"] = true;
                $obj -> resources["admin-player-btn-delete"] = true;
                $obj -> resources["admin-player-flash"] = true;
                $obj -> resources["admin-player-flash-customize"] = true;
                $obj -> resources["admin-player-flash-branding"] = true;
                $obj -> resources["admin-player-flash-plugin"] = true;
                $obj -> resources["admin-player-html5"] = true;

                $obj -> resources["admin-site"] = true;
                $obj -> resources["admin-site-limit"] = 5;
                $obj -> resources["admin-site-list-btn-add"] = true;
                $obj -> resources["admin-site-list-edit"] = true;
                $obj -> resources["admin-site-list-delete"] = true;
                $obj -> resources["admin-site-edit-tab-general"] = true;
                $obj -> resources["admin-site-edit-tab-asset"] = true;

                $obj -> resources["admin-process"] = true;

                $obj -> resources["admin-settings"] = true;
                $obj -> resources["admin-settings-btn-general"] = true;
                $obj -> resources["admin-settings-btn-user"] = true;

                $obj -> resources["admin-connector"] = true;
                $obj -> resources["admin-connector-limit"] = 5;
                $obj -> resources["admin-connector-btn-add"] = true;
                $obj -> resources["admin-connector-edit"] = true;
                $obj -> resources["admin-connector-delete"] = true;

                $obj -> resources["admin-connector-edits-facebook"] = true;
                $obj -> resources["admin-connector-edits-ftp"] = true;
                $obj -> resources["admin-connector-edits-twitter"] = true;
                $obj -> resources["admin-connector-edits-youtube"] = true;
                break;
            case "corporate" :
                $obj -> resources["admin-maxdata"] = 0;
                $obj -> resources["admin-api"] = true;

                $obj -> resources["admin-asset"] = true;
                $obj -> resources["admin-asset-list"] = true;
                $obj -> resources["admin-asset-list-edit"] = true;
                $obj -> resources["admin-asset-list-delete"] = true;
                $obj -> resources["admin-asset-list-max"] = 0;

                $obj -> resources["admin-asset-edit"] = true;
                $obj -> resources["admin-asset-edit-tab-general"] = true;
                $obj -> resources["admin-asset-edit-tab-tag"] = true;
                $obj -> resources["admin-asset-edit-tab-metadata"] = true;
                $obj -> resources["admin-asset-edit-tab-encoding"] = true;
                $obj -> resources["admin-asset-edit-tab-youtube"] = true;
                $obj -> resources["admin-asset-edit-btn-save"] = true;

                $obj -> resources["admin-playlist"] = true;
                $obj -> resources["admin-playlist-tab-general"] = true;
                $obj -> resources["admin-playlist-tab-metadata"] = true;
                $obj -> resources["admin-playlist-tab-asset"] = true;
                $obj -> resources["admin-playlist-btn-add"] = true;
                $obj -> resources["admin-playlist-btn-save"] = true;
                $obj -> resources["admin-playlist-btn-delete"] = true;
                $obj -> resources["admin-playlist-tab-asset-btn-add"] = true;

                $obj -> resources["admin-player"] = true;
                $obj -> resources["admin-player-add"] = true;
                $obj -> resources["admin-player-btn-update"] = true;
                $obj -> resources["admin-player-btn-delete"] = true;
                $obj -> resources["admin-player-flash"] = true;
                $obj -> resources["admin-player-flash-customize"] = true;
                $obj -> resources["admin-player-flash-branding"] = true;
                $obj -> resources["admin-player-flash-plugin"] = true;
                $obj -> resources["admin-player-html5"] = true;

                $obj -> resources["admin-site"] = true;
                $obj -> resources["admin-site-list-btn-add"] = true;
                $obj -> resources["admin-site-list-edit"] = true;
                $obj -> resources["admin-site-list-delete"] = true;
                $obj -> resources["admin-site-edit-tab-general"] = true;
                $obj -> resources["admin-site-edit-tab-channel"] = true;
                $obj -> resources["admin-site-edit-tab-asset"] = true;

                $obj -> resources["admin-process"] = true;

                $obj -> resources["admin-settings"] = true;
                $obj -> resources["admin-settings-btn-general"] = true;
                $obj -> resources["admin-settings-btn-groups"] = true;
                $obj -> resources["admin-settings-btn-user"] = true;

                $obj -> resources["admin-connector"] = true;
                $obj -> resources["admin-connector-limit"] = 5;
                $obj -> resources["admin-connector-btn-add"] = true;
                $obj -> resources["admin-connector-edit"] = true;
                $obj -> resources["admin-connector-delete"] = true;

                $obj -> resources["admin-connector-edits-facebook"] = true;
                $obj -> resources["admin-connector-edits-ftp"] = true;
                $obj -> resources["admin-connector-edits-twitter"] = true;
                $obj -> resources["admin-connector-edits-youtube"] = true;
                break;
        }

        return $obj;

    }

}
