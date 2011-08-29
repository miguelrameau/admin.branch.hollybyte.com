<?php

require_once 'BaseController.php';

class AssetController extends BaseController {

    /**
     *
     */
    public function init() {
        parent::init();
        $this->_log->info('[AssetController][init]');
        $this->authUser();
        $this->_resource = "asset";
        $this->_service = Dnovae_Hollybyte_Admin_Registry::getAssetService($this->_account);

        $this->config = Zend_registry::get('config');

        $this->view->repo = "https://".$this->config->regions->eu_w1->repo;

        if(empty($this->view->acl->resources["admin-asset"])) {
            return $this->_redirect('/home');
        }
    }

    /**
     *
     */
    public function indexAction() {
        $this->_log->info('[AssetController][indexAction]');
        $this->allowed($this->_account, $this->_userId, $this->_resource, 'read');

        $this->view->headScript()->appendFile('/js/flowplayer-3.2.6.min.js');
        $this->view->headScript()->appendFile('https://ajax.aspnetcdn.com/ajax/jquery.validate/1.8/jquery.validate.min.js');

        $this->view->headScript()->appendFile('/js/jquery/jquery.quicksearch.js');
        $this->view->headScript()->appendFile('/js/asset.js');
        $this->view->headScript()->appendFile('/js/assethelp/Asset.js');
        
        $this->view->headLink()->appendStylesheet('/css/asset.css');
        
    }

    /**
     *
     */
    public function formAction() {
        $this->_log->info('[AssetController][formAction]');
        $this->allowed($this->_account, $this->_userId, $this->_resource, 'read');

        $this->view->headScript()->appendFile('/js/flowplayer-3.2.6.min.js');
        $this->view->headScript()->appendFile('/js/jquery/jquery.iframe-post-form.min.js');
        $this->view->headScript()->appendFile('/js/widget/ColorPickerLoader.js');
        $this->view->headScript()->appendFile('/js/metavalue.js');
        //$this->view->headScript()->appendFile('/js/subtitle.js');
        $this->view->headScript()->appendFile('/js/jquery/jquery.dateFormat-1.0.js');
        $this->view->headScript()->appendFile('/js/asset.js');
        
        $this->view->headLink()->appendStylesheet('/css/asset.css');
        

        $id = $this->getRequest()->getParam("id", NULL);
        if(!empty($id)) {
            $asset = $this->_service->findById($id);
            $this->_log->info('[AssetController][formAction] Entity: '.print_r($asset, TRUE));
            $this->view->entity = $asset;
        } else {
            $this->_redirect('/asset');
        }
    }

    /**
     *
     */
    public function snapshotAction() {
        $this->_log->info('[AssetController][snapshotAction]');
        $this->allowed($this->_account, $this->_userId, $this->_resource, 'update');
        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        $id = $this->getRequest()->getParam("id", NULL);
        $second = $this->getRequest()->getParam("second", NULL);
        $result = $this->_service->snapshot($id, $second);
        echo json_encode(array('result' => $result));
    }

    /**
     *
     */
    public function reencodeAction() {
        $this->_log->info('[AssetController][snapshotAction]');
        $this->allowed($this->_account, $this->_userId, $this->_resource, 'update');
        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        $id = $this->getRequest()->getParam("id", NULL);
        $content = $this->getRequest()->getParam("content", NULL);
        echo json_encode(array('result' => TRUE));
    }

    /**
     *
     */
    public function youtubeAction() {
        $this->_log->info('[AssetController][youtubeAction]');
        $this->allowed($this->_account, $this->_userId, $this->_resource, 'update');
        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        $id = $this->getRequest()->getParam("id", NULL);
        $connector = $this->getRequest()->getParam("connector", NULL);
        $category = $this->getRequest()->getParam("category", NULL);
        $result = $this->_service->uploadYoutube($id, $connector, $category);
        echo json_encode(array('result' => $result));
    }
    
    /**
     * 
     */
    public function splashAction() {
        $this->_log->info('[AssetController][splashAction]');
        $this->allowed($this->_account, $this->_userId, $this->_resource, 'read');
        $this->_helper->layout->disableLayout();

        $id = $this->getRequest()->getParam('id', NULL);
        $filename = $this->getRequest()->getParam('filename', NULL);
        
        $flag = $this->_service->splash($id, $filename);
        $this->view->result = $flag;
    }
    
    /**
     * 
     */
    public function subtitleAction() {
        $this->_log->info('[AssetController][subtitleAction]');
        $this->allowed($this->_account, $this->_userId, $this->_resource, 'read');
        $this->_helper->layout->disableLayout();

        $id = $this->getRequest()->getParam('id', NULL);
        $filename = $this->getRequest()->getParam('filename', NULL);
        $type = $this->getRequest()->getParam('type', NULL);
        $lang = $this->getRequest()->getParam('lang', NULL);
        
        $flag = $this->_service->subtitle($id, $filename, $type, $lang);
        $this->view->result = $flag;
    }
    
    /**
     * 
     */
    public function deleteSubtitleAction() {
        $this->_log->info('[AssetController][deleteSubtitleAction]');
        $this->allowed($this->_account, $this->_userId, $this->_resource, 'delete');
        $this->_helper->layout->disableLayout();

        $id = $this->getRequest()->getParam('id', NULL);
        $filename = $this->getRequest()->getParam('filename', NULL);
        
        $flag = $this->_service->deleteSubtitle($id, $filename);
        $this->view->result = $flag;
    }
    
    /**
     * 
     */
    public function deployAction() {
        $this->_log->info('[AssetController][deployAction]');
        $this->allowed($this->_account, $this->_userId, $this->_resource, 'delete');
        $this->_helper->layout->disableLayout();
        
        $settings = Dnovae_Hollybyte_Admin_Registry::getSettingsService($this->_account);
        $set = $settings->findById($this->_account);
        $id = $set['defaultSite'];
        $site = Dnovae_Hollybyte_Admin_Registry::getSiteService($this->_account);

        $data = $site->deploy($id);
        $this->view->result = $data;
    }
}
