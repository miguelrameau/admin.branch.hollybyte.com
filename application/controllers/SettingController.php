<?php

require_once 'BaseController.php';

class SettingController extends BaseController {

    /**
     *
     */
    public function init() {
        parent::init();
        $this->_log->info('[SettingsController][init]');
        $this->authUser();
        $this->_resource = "settings";
        $this->_service = Dnovae_Hollybyte_Admin_Registry::getSettingsService($this->_account);
    }

    /**
     *
     */
    public function indexAction() {
        $this->_log->info('[SettingsController][indexAction]');
        $this->allowed($this->_account, $this->_userId, $this->_resource, 'read');

        $this->view->headScript()->appendFile('/js/setting.js');

        $this->view->headLink()->appendStylesheet('/css/common.css');
    }

    /**
     *
     */
    public function dataAction() {
        $this->_log->info('[SettingsController][dataAction]');
        $this->allowed($this->_account, $this->_userId, $this->_resource, 'read');
        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        $accountService = Dnovae_Hollybyte_Admin_Registry::getAccountService();
        $account = $accountService->findById($this->_account);

        $result = $this->_service->findById($this->_account);
        $result['region'] = $account['region'];
        echo json_encode($result);
    }

    /**
     *
     */
    public function mediasAction() {
        $this->_log->info('[SettingsController][mediasAction]');
        $this->allowed($this->_account, $this->_userId, $this->_resource, 'read');
        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        $mediaService = Dnovae_Hollybyte_Admin_Registry::getMediaService();
        $result = $mediaService->find();
        echo json_encode( array('result' => $result));
    }

}
