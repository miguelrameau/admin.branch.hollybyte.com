<?php

require_once 'BaseController.php';
require_once "Dnovae/Util/Facebook.php";
require_once ('Dnovae/Util/Twitter.php');

/**
 * @author fospitia
 *
 */
class ConnectorController extends BaseController {

    /**
     *
     */
    public function init() {
        parent::init();
        $this->_log->info('[ConnectorController][init]');
        $this->authUser();
        $this->_resource = "connector";
        $this->_service = Dnovae_Hollybyte_Admin_Registry::getConnectorService($this->_account);
        if(empty($this->view->acl->resources["admin-connector"])) {
            return $this->_redirect('/home');
        }
    }

    /**
     *
     */
    public function indexAction() {
        $this->_log->info('[ConnectorController][indexAction]');
        $this->allowed($this->_account, $this->_userId, $this->_resource, 'read');

        $this->view->headScript()->appendFile('/js/connector/connector.js');
    }

    /**
     *
     */
    public function formAction() {
        $this->_log->info('[ConnectorController][formAction]');
        $this->allowed($this->_account, $this->_userId, $this->_resource, 'read');

        $this->view->headScript()->appendFile('http://ajax.aspnetcdn.com/ajax/jquery.validate/1.8.1/additional-methods.min.js');
        $this->view->headScript()->appendFile('/js/connector/connector.js');

        $id = $this->getRequest()->getParam("id", NULL);
        if(!empty($id)) {
            $this->view->entity = $this->_service->findById($id);
        }
    }

    /**
     *
     */
    public function registerFacebookAction() {
        $this->_log->info('[ConnectorController][registerFacebookAction]');
        $this->allowed($this->_account, $this->_userId, $this->_resource, 'read');

        $fb = new Dnovae_Util_Facebook();
        $id = $this->getRequest()->getParam("id", NULL);
        if(empty($id)) {
            $this->view->result = FALSE;
            return ;
        } else {
            $url = $fb->getCode($id);
            $this->view->data = $url;
        }
    }

    /**
     *
     */
    public function facebookAction() {
        $this->_log->info('[ConnectorController][facebookAction]');
        $this->_helper->layout->disableLayout();

        $id = $this->getRequest()->getParam("id", NULL);
        if(empty($id)) {
            $this->view->result = FALSE;
            return ;
        }
        $this->_log->info('[ConnectorController][facebookAction] id: '.print_r($id, TRUE));
        $message = $this->getRequest()->getParam("message", NULL);
        if(empty($message)) {
            $this->view->result = FALSE;
            return ;
        }
        $this->_log->info('[ConnectorController][facebookAction] message '.print_r($message, TRUE));
        $link = $this->getRequest()->getParam("link", NULL);
        if(empty($link)) {
            $this->view->result = FALSE;
            return ;
        }
        $this->_log->info('[ConnectorController][facebookAction] link '.print_r($link, TRUE));
        $picture = $this->getRequest()->getParam('picture', NULL);
        if(empty($picture)) {
            $this->view->result = FALSE;
            return ;
        }
        $this->_log->info('[ConnectorController][facebookAction] picture '.print_r($picture, TRUE));
        $source = $this->getRequest()->getParam('source', NULL);
        if(empty($source)) {
            $this->view->result = FALSE;
            return ;
        }
        $this->_log->info('[ConnectorController][facebookAction] source '.print_r($source, TRUE));
        $caption = $this->getRequest()->getParam('caption', NULL);

        $conn = $this->_service->findById($id);
        $this->_log->debug('[ConnectorController][facebookAction] connector '.print_r($conn, TRUE));
        if(!is_array($conn)) {
            $this->_log->debug('[ConnectorController][facebookAction] not array ');
            $this->view->result = FALSE;
        } else if($conn['type'] == "FACEBOOK" && !empty($conn['conf']['token'])) {
            $fb = new Dnovae_Util_Facebook();
            $data = array('oauth_token' => $conn['conf']['token'], 'message' => $message, 'link' => $link, "picture" => $picture, "source" => $source);
            if(!empty($caption)) {
                $data['caption'] = $caption;
            }
            $result = $fb->postVideo($conn['conf']['username'], $data);
            $this->view->result = $result;
        }
    }

    /**
     *
     */
    public function registerTwitterAction() {
        $ns = new Zend_Session_Namespace('Default');

        $id = $this->getRequest()->getParam("id", NULL);
        $ns->connector = $id;
        $twitter = new Dnovae_Util_Twitter();
        $url = $twitter->register();
        $this->view->data = $url;
    }

    /**
     *
     */
    public function twitterAction() {
        $this->_log->info('[ConnectorController][twitterAction]');
        $this->_helper->layout->disableLayout();

        $id = $this->getRequest()->getParam("id", NULL);
        if(empty($id)) {
            $this->view->result = FALSE;
            return ;
        }
        $message = $this->getRequest()->getParam("message", NULL);
        if(empty($message)) {
            $this->view->result = FALSE;
            return ;
        }
        $link = $this->getRequest()->getParam("link", NULL);
        if(empty($link)) {
            $this->view->result = FALSE;
            return ;
        }
        $conn = $this->_service->findById($id);
        if(!is_array($conn)) {
            $this->view->result = FALSE;
        } else if($conn['type'] == "TWITTER" && !empty($conn['conf']['oauth_token']) && !empty($conn['conf']['oauth_token_secret'])) {
            $twitter = new Dnovae_Util_Twitter();
            $short = $twitter->shorterUrl($link);
            $msg = $message.' '.$short['id'];
            $status = $twitter->newStatus($conn['conf']['oauth_token'], $conn['conf']['oauth_token_secret'], $msg);
            $this->view->result = $status;
        }
    }

}
