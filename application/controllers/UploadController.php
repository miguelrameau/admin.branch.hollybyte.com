<?php

require_once 'BaseController.php';
require_once 'UploadHandler.php';

/**
 *
 * @author fospitia
 *
 */
class UploadController extends BaseController {
    /* (non-PHPdoc)
     * @see BaseController::init()
     */
    public function init() {
        parent::init();
        $this->_log->info('[UploadController][init]');
        //$this->authUser();
        $this->_resource = "asset";
        $this->_account = $this->getCurrentAccountId();
        if(empty($this->_account)){
            $this->_account = $this->getRequest()->getParam('account', NULL);
        }
        
        $this->view->account = $this->_account;
        $this->_log->info('[UploadController][init] account: '.print_r($this->_account, TRUE));
        $this->_service = Dnovae_Hollybyte_Admin_Registry::getUploadService($this->_account);
    }

    /**
     *
     */
    public function indexAction() {
        $this->_log->info('[UploadController][indexAction]');
        $this->_helper->layout()->setLayout('upload');
    }

    /**
     *
     */
    public function uploadAction() {
        $this->_log->info('[UploadController][uploadAction]');
        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        $upload_handler = new UploadHandler();

        header('Pragma: no-cache');
        header('Cache-Control: private, no-cache');

        switch ($_SERVER['REQUEST_METHOD']) {
            case 'HEAD' :

            case 'GET' :
                $this->_log->info('[UploadController][uploadAction]GET');
                $upload_handler->get();
                break;
            case 'POST' :
                $this->_log->info('[UploadController][uploadAction]POST');
                $upload_handler->post();
                break;
            case 'DELETE' :
                $this->_log->info('[UploadController][uploadAction]DELETE');
                $upload_handler->delete();
                break;
            default :
                header('HTTP/1.0 405 Method Not Allowed');
        }
    }

    /**
     *
     */
    public function assetAction() {
        $this->_log->info('[UploadController][assetAction]');
        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        $this->_log->info('[UploadController][assetAction] FILES: '.print_r($_FILES, true));
        $this->_log->info('[UploadController][assetAction] FILES name: '.print_r($_FILES['file']['name'], true));
        $this->_log->info('[UploadController][assetAction] FILES tmp_name: '.print_r($_FILES['file']['tmp_name'], true));

        if(filesize($_FILES['file']['tmp_name']) !== $_FILES['file']['size']) {
            echo json_encode(array('result' => FALSE));
        } else {
            $result = $this->_service->upload($_FILES['file']['name'], $_FILES['file']['tmp_name']);
            $this->_log->info('[UploadController][assetAction] result: '.print_r($result, true));
            $assetManager = Dnovae_Hollybyte_Admin_Registry::getAssetService($this->_account);
            $asset = $assetManager->createFromFile($result['path']);
            $this->_log->info('[UploadController][assetAction] asset: '.print_r($asset, true));
            echo json_encode($asset);
        }
    }

    /**
     *
     */
    public function fileAction() {
        $this->_log->info('[UploadController][fileAction]');
        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        if(isset($_FILES)) {
            foreach($_FILES as $key => $value) {
                $this->_log->info('[UploadController][fileAction] FILES: '.print_r($_FILES, true));
                $name = $value['name'];
                $type = $value['type'];
                $tmpName = $value['tmp_name'];
                $error = $value['error'];
                $size = $value['size'];
                $result = $this->_service->upload($name, $tmpName);
                $this->_log->info('[UploadController][fileAction] result: '.print_r($result, true));
                echo json_encode($result);
                break;
                //Sólo coge un FILE
            }
        }
    }

}
