<?php

require_once 'BaseController.php';

/*
 *
 */
class SiteController extends BaseController {

    /**
     *
     */
    public function init() {
        parent::init();
        $this->_log->info('[SiteController][init]');
        $this->authUser();
        $this->_resource = "site";
        $this->_service = Dnovae_Hollybyte_Admin_Registry::getSiteService($this->_account);
        if(empty($this->view->acl->resources["admin-site"])){
            return $this->_redirect('/home');
        }
    }

    /**
     *
     */
    public function indexAction() {
        $this->_log->info('[SiteController][indexAction]' . $this->_account);
        $this->allowed($this->_account, $this->_userId, $this->_resource, 'read');

        $this->view->headScript()->appendFile('/js/site/site.js');

        $this->view->headLink()->appendStylesheet('/css/common.css');
        $this->view->headLink()->appendStylesheet('/css/site.css');
    }

    /**
     *
     */
    public function formAction() {
        $this->_log->info('[SiteController][formAction]' . $this->_account);
        $this->allowed($this->_account, $this->_userId, $this->_resource, 'read');
  
        $this->view->headScript()->appendFile('/js/jquery/jquery.bsmselect.js');
        $this->view->headScript()->appendFile('/js/jquery/jquery.bsmselect.sortable.js');
        $this->view->headScript()->appendFile('/js/jquery/jquery.bsmselect.compatibility.js');
        $this->view->headScript()->appendFile('/js/site/site.js');

        $this->view->headLink()->appendStylesheet('/css/jquery.bsmselect.css');

        $this->view->headLink()->appendStylesheet('/css/common.css');
        $this->view->headLink()->appendStylesheet('/css/site.css');

        $id = $this->getRequest()->getParam("id", NULL);
        if(!empty($id)) {
            $this->view->entity = $this->_service->findById($id);
            $this->_service->sync($id);
        }
    }

    /**
     *
     */
    public function playersAction() {
        $this->_log->info('[SiteController][playersAction]');
        $this->allowed($this->_account, $this->_userId, $this->_resource, 'read');
        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        $playerService = Dnovae_Hollybyte_Admin_Registry::getPlayerService($this->_account);
        $result = $playerService->find();
        echo json_encode( array('result' => $result));
    }

    /**
     *
     */
    public function connectorsAction() {
        $this->_log->info('[SiteController][connectorsAction]');
        $this->allowed($this->_account, $this->_userId, $this->_resource, 'read');
        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        $connectorService = Dnovae_Hollybyte_Admin_Registry::getConnectorService($this->_account);
        $connectors = $connectorService->find();

        $result = array();
        foreach($connectors as $connector) {
            if(!isset($connector['type'])) {
                continue ;
            }
            if($connector['type'] == "FACEBOOK") {
                $connector['img'] = "/images/connector/facebook.png";
                $result[] = $connector;
            }
            if($connector['type'] == "TWITTER") {
                $connector['img'] = "/images/connector/twitter.png";
                $result[] = $connector;
            }
        }
        echo json_encode( array('result' => $result));
    }

    /**
     *
     */
    public function playlistsAction() {
        $this->_log->info('[SiteController][playlistsAction]');
        $this->allowed($this->_account, $this->_userId, $this->_resource, 'read');
        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        $playlistService = Dnovae_Hollybyte_Admin_Registry::getPlaylistService($this->_account);
        $result = $playlistService->roots();
        echo json_encode( array('result' => $result));
    }

    /**
     *
     */
    public function findAssetsAction() {
        $this->_log->info('[SiteController][findAssetsAction]');
        $this->allowed($this->_account, $this->_userId, $this->_resource, 'read');
        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        $id = $this->getRequest()->getParam("id", NULL);
        if(empty($id)) {
            echo json_encode( array('result' => array()));
            return ;
        }
        $result = $this->_service->findAssets($id);
        $this->_log->info('[SiteController][findAssetsAction]' . print_r($result, TRUE));
        echo json_encode( array('result' => $result));
    }

    /**
     *
     */
    public function updateAssetsAction() {
        $this->_log->info('[SiteController][updateAssetsAction]');
        $this->allowed($this->_account, $this->_userId, $this->_resource, 'read');
        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        $id = $this->getRequest()->getParam("id", NULL);
        if(empty($id)) {
            echo json_encode( array('result' => false));
            return ;
        }
        $this->_log->info('[SiteController][updateAssetsAction] id: ' . print_r($id, TRUE));
        $siteAssets = $this->getRequest()->getParam("data", NULL);
        if(empty($siteAssets)) {
            echo json_encode( array('result' => false));
            return ;
        } else {
            $siteAssets = json_decode($siteAssets, TRUE);
        }
        $this->_log->info('[SiteController][updateAssetsAction] siteAssets: ' . print_r($siteAssets, TRUE));
        $result = $this->_service->updateAssets($id, $siteAssets);
        echo json_encode( array('result' => $result));
    }

    public function createAction(){
        $data = parent::createAction();
        
        $this->_service->sync($data["id"]);
        $this->_service->deploy($data["id"]);
    }

    public function updateAction(){
        $data = parent::updateAction();
        
        $id = $this->getRequest()->getParam("id", NULL);
        $this->_service->sync($id);
        $this->_service->deploy($id);
    }
}
