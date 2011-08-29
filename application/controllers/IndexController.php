<?php

require_once 'BaseController.php';

class IndexController extends BaseController
{

    /**
     *
     */
    public function init()
    {
        $this->_log = Zend_Registry::get('log');
        $this->_log->info('[IndexController][init]');
    }

    /**
     *
     */
    public function indexAction()
    {
        $this->_log->info('[IndexController][indexAction]');
        $this->authUser();
        return $this->_redirect('/home');
    }
    
    public function loginAction(){
        $this->_helper->layout->disableLayout();
        $this->_helper->layout()->setLayout('anonymous');
    }
    
    public function nopermissionAction(){
        $this->_helper->layout->disableLayout();
         $this->_helper->layout()->setLayout('anonymous');
    }
    
    public function registerAction(){
        $this->_helper->layout->disableLayout();
        $this->_helper->layout()->setLayout('anonymous');
    }
    
    
}
