<?php

require_once 'Dnovae/Hollybyte/Admin/Registry.php';
require_once "Dnovae/Util/Facebook.php";
require_once "Dnovae/Util/Twitter.php";

class CbController extends Zend_Controller_Action {

    protected $_log = NULL;
    protected $_account = NULL;
    protected $_service = NULL;
    protected $_id = NULL;

    /**
     *
     */
    public function init() {
        $this->_log = Zend_Registry::get('log');
        $this->_log->info('[CallbackController][init]');

        $this->_id = $this->getRequest()->getParam("state", NULL);
        $ns = $ns = new Zend_Session_Namespace('Default');
        $this->_account = $ns->currentAccount['id'];
        $this->_service = Dnovae_Hollybyte_Admin_Registry::getConnectorService($this->_account);
    }

    /**
     *
     */
    public function facebookAction() {
        $this->_log->info('[CallbackController][facebookAction]');
        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        $fb = new Dnovae_Util_Facebook();
        $code = $this->getRequest()->getParam('code');
        $acc_tk = $fb->getAccessToken($code);
        $char = substr($acc_tk, 0, 1);
        if($char === "{") {
            $this->view->result = FALSE;
            $this->_redirect('http://admin.hollybyte.com/connector');
        } else {
            $connector = $this->_service->findById($this->_id);
            if(is_array($connector)) {
                $connector['conf']['token'] = $acc_tk;
                $data = $this->_service->update($this->_id, $connector);
                $this->view->result = $data;
                $this->_redirect('http://admin.hollybyte.com/connector');
                return ;
            } else {
                $this->view->result = FALSE;
                $this->_redirect('/connector');
            }
        }
    }

    /**
     *
     */
    public function twitterAction() {
        $this->_log->info('[CallbackController][twitterAction]');
        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        $ns = new Zend_Session_Namespace('Default');
        $twitter = new Dnovae_Util_TwitterConnect();

        $oauth_token = $this->getRequest()->getParam('oauth_token');
        $credentials = $twitter->callback($oauth_token);

        $id = $ns->connector;
        unset($ns->connector);
        $connector = $this->_service->findById($id);

        if(is_array($connector)) {
            $connector['conf']['oauth_token'] = $credentials['oauth_token'];
            $connector['conf']['oauth_token_secret'] = $credentials['oauth_token_secret'];
            $name = $twitter->getScreenName($credentials['oauth_token'], $credentials['oauth_token_secret']);
            $connector['conf']['username'] = $name;
            $data = $this->_service->update($id, $connector);
            $this->view->result = $data;
        } else {
            $this->view->result = FALSE;
        }
        $this->_redirect('/connector');
    }

}
