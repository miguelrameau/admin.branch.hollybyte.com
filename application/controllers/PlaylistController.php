<?php
require_once 'BaseController.php';

class PlaylistController extends BaseController {

    /**
     *
     */
    public function init() {
        parent::init();
        $this->_log->info('[PlaylistController][init]');
        $this->authUser();
        $this->_resource = "playlist";
        $this->_service = Dnovae_Hollybyte_Admin_Registry::getPlaylistService($this->_account);
        if(empty($this->view->acl->resources["admin-playlist"])) {
            return $this->_redirect('/home');
        }
    }

    /**
     *
     */
    public function indexAction() {
        $this->_log->info('[PlaylistController][indexAction]');
        $this->allowed($this->_account, $this->_userId, $this->_resource, 'read');

        $this->view->headScript()->appendFile('/js/jquery/jquery.treeTable.min.js', 'text/javascript');
        $this->view->headScript()->appendFile('/js/jquery/jquery.iframe-post-form.min.js', 'text/javascript');
        $this->view->headScript()->appendFile('/js/widget/ColorPickerLoader.js');
        $this->view->headScript()->appendFile("/js/metavalue.js", 'text/javascript');
        $this->view->headScript()->appendFile('/js/playlist/playlist.js', 'text/javascript');
        $this->view->headScript()->appendFile('/js/jquery/jquery.iframe-post-form.min.js', 'text/javascript');
        $this->view->headLink()->appendStylesheet('/css/jquery.treeTable.css');
        $this->view->headLink()->appendStylesheet('/css/playlistAssetTable.css');
        //$this->view->headLink()->appendStylesheet('/css/playlist/playlist.css');
    }

    /**
     *
     */
    public function formAction() {
        $this->_log->info('[PlaylistController][formAction]');
        $this->allowed($this->_account, $this->_userId, $this->_resource, 'read');
    }

    /**
     *
     */
    public function assetsAction() {
        $this->_log->info('[PlaylistController][assetsAction]');
        $this->allowed($this->_account, $this->_userId, $this->_resource, 'read');
        $this->_helper->layout->disableLayout();

        $id = $this->getRequest()->getParam('id', NULL);
        $criteria = $this->getRequest()->getParam('criteria', array());
        if(!empty($criteria)) {
            $criteria = json_decode($criteria, TRUE);
        }
        $fields = $this->getRequest()->getParam('fields', array());
        if(!empty($fields)) {
            $fields = json_decode($fields, TRUE);
        }
        $sort = $this->getRequest()->getParam('sort', array());
        if(!empty($sort)) {
            $sort = json_decode($sort, TRUE);
        }

        $datas = $this->_service->getAssets($id, $criteria, $fields, $sort);
        $this->view->result = array('result' => $datas);
    }

    /**
     *
     */
    public function diffAction() {
        $this->_log->info('[PlaylistController][diffAction]');
        $this->allowed($this->_account, $this->_userId, $this->_resource, 'read');
        $this->_helper->layout->disableLayout();

        $id = $this->getRequest()->getParam('id', NULL);
        $criteria = $this->getRequest()->getParam('criteria', array());
        if(!empty($criteria)) {
            $criteria = json_decode($criteria, TRUE);
        }
        $fields = $this->getRequest()->getParam('fields', array());
        if(!empty($fields)) {
            $fields = json_decode($fields, TRUE);
        }

        $datas = $this->_service->diffAssets($id, $criteria, $fields);
        $this->view->result = array('result' => $datas);
    }

    /**
     *
     */
    public function upAssetsAction() {
        $this->_log->info('[PlaylistController][upAssetAction]');
        $this->allowed($this->_account, $this->_userId, $this->_resource, 'read');
        $this->_helper->layout->disableLayout();

        $id = $this->getRequest()->getParam('id', NULL);
        $playlistAsset = $this->getRequest()->getParam('playlistAsset', array());
        if(!empty($playlistAsset)) {
            $playlistAsset = json_decode($playlistAsset, TRUE);
        }
        $data = $this->_service->addPlaylistAsset($id, $playlistAsset);
        $this->view->result = array('result' => $data);
    }

    /**
     *
     */
    public function removeAssetAction() {
        $this->_log->info('[PlaylistController][removeAction]');
        $this->allowed($this->_account, $this->_userId, $this->_resource, 'read');
        $this->_helper->layout->disableLayout();

        $id = $this->getRequest()->getParam('id', NULL);
        $playlistAsset = $this->getRequest()->getParam('playlistAsset', NULL);

        $data = $this->_service->removePlaylistAsset($id, $playlistAsset);
        $this->view->result = array('result' => $data);
    }

    /**
     *
     */
    public function treeAction() {
        $this->_log->info('[PlaylistController][treeAction]');
        $this->allowed($this->_account, $this->_userId, $this->_resource, 'read');
        $this->_helper->layout->disableLayout();

        $data = $this->getRequest()->getParam('data', array());
        if(!empty($data)) {
            $data = json_decode($data, TRUE);
        }

        $index = array();
        $insert = array();
        $table = '<table id="tree">';
        $table .= self::recursiveTable($data, $index, $insert);
        $table .= '</table>';

        $this->view->table = $table;
    }

    /**
     *
     */
    public function newAction() {
        $this->_log->info('[PlaylistController][newAction]');
        $this->allowed($this->_account, $this->_userId, $this->_resource, 'read');
        $this->_helper->layout->disableLayout();

        $data = $this->getRequest()->getParam('data', NULL);
        if(!empty($data)) {
            $data = json_decode($data, TRUE);
        }

        $return = $this->_service->create($data);

        if(isset($data['parent'])) {
            $this->_service->modify($data['parent'], array('$push' => array('children' => $data['id'])));
        }

        $this->view->result = $return;
    }

    /**
     *
     */
    public function splashAction() {
        $this->_log->info('[PlaylistController][newAction]');
        $this->allowed($this->_account, $this->_userId, $this->_resource, 'read');
        $this->_helper->layout->disableLayout();

        $id = $this->getRequest()->getParam('id', NULL);
        $filename = $this->getRequest()->getParam('filename', NULL);

        $flag = $this->_service->splash($id, $filename);
        $this->_log->debug('[PlaylistController][SplashAction] flag: '.print_r($flag, TRUE));

        $this->view->result = $flag;

    }

    /**
     *
     */
    private function recursiveTable($data, &$index, &$insert, $father = NULL) {
        $this->_log->info('[PlaylistController][recursiveTable]');
        $return = "";
        foreach($data as $value) {
            if(!isset($value['parent']) && !in_array($value['id'], $insert) && $father == NULL) {

                $name = $value['id'];
                $return .= '<tr id="node-'.$name.'" onClick="HB2.admin.playlist.onClickBranch(this)">';
                $return .= '<td>'.$value['title'].'</td>';
                $return .= '</tr>';
                $index[$name] = $name;
                $insert[] = $name;
                if(isset($value['children'])) {
                    $return .= self::recursiveTable($data, $index, $insert, $name);
                }
            } else if(isset($value['parent']) && isset($father) && $value['parent'] == $father && !in_array($value['id'], $insert)) {
                $name = $value['id'];
                $parent = $value['parent'];
                $return .= '<tr id="node-'.$name.'"'.'class="child-of-node-'.$index[$parent].'" onClick="HB2.admin.playlist.onClickBranch(this)">';
                $return .= '<td>'.$value['title'].'</td>';
                $return .= '</tr>';
                $index[$name] = $name;
                $insert[] = $name;
                if(isset($value['children'])) {
                    $return .= self::recursiveTable($data, $index, $insert, $name);
                }
            }
        }
        return $return;
    }

}
