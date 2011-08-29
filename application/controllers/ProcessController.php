<?php

require_once 'BaseController.php';

class ProcessController extends BaseController
{

    /**
    *
    */
    public function init()
    {
        parent::init();
        $this->_log->info('[ProcessController][init]');
        $this->authUser();
        $this->_resource = "process";
        $this->_service = Dnovae_Hollybyte_Admin_Registry::getProcessService($this->_account);
        if(empty($this->view->acl->resources["admin-process"])){
            return $this->_redirect('/home');
        }
    }

    /**
    *
    */
    public function indexAction()
    {
        $this->_log->info('[ProcessController][indexAction]' . $this->_account);
        $this->allowed($this->_account, $this->_userId, $this->_resource, 'read');
    }
 }