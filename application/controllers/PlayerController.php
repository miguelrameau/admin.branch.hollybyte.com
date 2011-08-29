<?php

require_once 'BaseController.php';

class PlayerController extends BaseController
{

    /**
    *
    */
    public function init()
    {
        parent::init();
        $this->_log->info('[PlayerController][init]');
        $this->_account = $this->getCurrentAccountId();
        $this->_resource = "player";
        $this->_service = Dnovae_Hollybyte_Admin_Registry::getPlayerService($this->_account);
        if(empty($this->view->acl->resources["admin-player"])){
            return $this->_redirect('/home');
        }
    }

    /**
    *
    */
    public function indexAction()
    {
        $this->authUser();
        $this->_log->info('[PlayerController][indexAction]');
        $this->allowed($this->_account, $this->_userId, $this->_resource, 'read');
        
        $this->view->headScript()->appendFile('/js/player/player.js');
        $playerlist= $this->_service->find();
        $this->view->entity = $playerlist;
    }

    /**
    *
    */
    public function formAction()
    {
        $this->authUser();
        $this->_log->info('[PlayerController][formAction]');
        $this->allowed($this->_account, $this->_userId, $this->_resource, 'read');

        $this->view->headScript()->appendFile('https://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js');
        $this->view->headScript()->appendFile('/js/flowplayer-3.2.6.min.js');
        $this->view->headScript()->appendFile('/js/jquery/jquery.iframe-post-form.min.js');
        $this->view->headScript()->appendFile('/js/player/player.js');
        $this->view->headLink()->appendStylesheet('/css/common.css');
        $this->view->headLink()->appendStylesheet('/css/playerform.css');
        //$this->view->headLink()->appendStylesheet('/css/player.css');

        $id = $this->getRequest()->getParam("id", NULL);
        if (!empty($id)) {
            $player = $this->_service->findById($id);
            $this->view->entity = $player;
            $this->_log->info('[PlayerController][formAction] Player: '.print_r($this->view->entity, TRUE));
        }
        $this->view->region = $this->getCurrentAccountRegion();
    }
    
    /**
     *
     */
    /**
     *
     */
    public function uploadAction() {
        $this->_log->info('[UploadController][fileAction]');
        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();
        
        $uploadService = Dnovae_Hollybyte_Admin_Registry::getUploadService($this->_account);

        if(isset($_FILES)) {
            foreach($_FILES as $key => $value) {
                $this->_log->info('[UploadController][fileAction] FILES: '.print_r($_FILES, true));
                $name = $value['name'];
                $type = $value['type'];
                $tmpName = $value['tmp_name'];
                $error = $value['error'];
                $size = $value['size'];
                $result = $uploadService->upload($name, $tmpName);
                $this->_log->info('[UploadController][fileAction] result: '.print_r($result, true));
                echo json_encode($result);
                break;
                //Sólo coge un FILE
            }
        }
    }

    /**
    *
    */
    public function getconfAction(){
        $this->_helper->layout->disableLayout();
        $id = $this->getRequest()->getParam("id", NULL);
        $this->view->id = $id;
        if (!empty($id)) {
           $this->view->entity = $this->_service->findById($id);
            $this->_log->debug("playerController[getconf][entity]".print_r($this->view->entity, true));
        }
    }
    
    /**
     * 
     */
    public function logoAction() {
        $this->_log->info('[PlayerController][logoAction]');
        $this->allowed($this->_account, $this->_userId, $this->_resource, 'read');
        $this->_helper->layout->disableLayout();

        $id = $this->getRequest()->getParam('id', NULL);
        $filename = $this->getRequest()->getParam('filename', NULL);
        
        $flag = $this->_service->logo($id, $filename);
        $this->view->result = $flag;
    }
    
    /**
     * 
     */
    public function playAction() {
        $this->_log->info('[PlayerController][logoAction]');
        $this->allowed($this->_account, $this->_userId, $this->_resource, 'read');
        $this->_helper->layout->disableLayout();

        $id = $this->getRequest()->getParam('id', NULL);
        $filename = $this->getRequest()->getParam('filename', NULL);
        
        $flag = $this->_service->play($id, $filename);
        $this->view->result = $flag;
    }
 }