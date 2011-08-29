<?php

require_once 'BaseController.php';

class HomeController extends BaseController {

    /**
     *
     */
    public function init() {
        $this->authUser();
        parent::init();
        $this->_log->info('[HomeController][init]');
        $this->_acl = $this->getAcl();
    }

    /**
     *
     */
    public function indexAction() {
        $this->_log->info('[HomeController][indexAction]');
    }

    /**
     *
     */
    public function changeAction() {
        $this->_log->info('[HomeController][changeAction]');
        //$this->_helper->layout->disableLayout();
        //$this->_helper->viewRenderer->setNoRender();

        $id = $this->getRequest()->getParam('id');
        $ns = new Zend_Session_Namespace('Default');
        $accountService = Dnovae_Hollybyte_Admin_Registry::getAccountService();
        $ns->currentAccount = $accountService->findById($id);

        //$this->_redirect('/home');
        //header ('Location:/home');
        $this->view->return = true;
    }

}
