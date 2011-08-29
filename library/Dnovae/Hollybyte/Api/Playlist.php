<?php

require_once 'Dnovae/Hollybyte/Api/Rest.php';

class Dnovae_Hollybyte_Api_Playlist extends Dnovae_Hollybyte_Api_Rest {
    
    protected $url = "https://api.hollybyte.com/playlist";
    
    /**
    *
    */
    function __construct($user, $secret, $account) {
        parent::__construct($user, $secret, $this->url, $account);
    }

    /**
    * $return True || False
    */
    function addPlaylistAsset ($id, $playlistAsset) {

        $token = $this->getOauthToken();
        $acc_tk = $token['access_token'];

        $encode = json_encode($playlistAsset);

        $url = $this->url."/add-playlist-asset";
        $param = array ("oauth_token" => $acc_tk, "account" => $this->account, "id" => $id, "playlistAsset" => $encode);

        $this->curl->setUrl($url);
        $this->curl->setParam($param);
        $data = $this->curl->putCurl(strlen($encode));

        $decode = json_decode($data, TRUE);
        if(isset($decode['error_code'])) {
            return $data;
        } else {
            return $decode['result'];
        }
    }
    
    /**
    * @return True || False
    */
    function removePlaylistAsset ($id, $playlists) {
        
        $token = $this->getOauthToken();
        $acc_tk = $token['access_token'];

        $encode = json_encode($playlists);
        
        $url = $this->url."/remove-playlist-asset?oauth_token=".$acc_tk."&account=".$this->account."&id=".$id."&playlistAsset=".$encode;
        
        $this->curl->setUrl($url);
        $data = $this->curl->deleteCurl();
        
        $decode = json_decode($data, TRUE);
        if(isset($decode['error_code'])) {
            return $data;
        } else {
            return (bool) $decode['result'];
        }
    }

    /**
    * @return an array of assets.
    */
    function getAssets ($id, $criteria = array(), $fields = array(), $sort = array()) {
        
        $token = $this->getOauthToken();
        $acc_tk = $token['access_token'];
        
        $url = $this->url."/get-assets?oauth_token=".$acc_tk."&account=".$this->account."&id=".$id;
        if (!empty($criteria)) {
            $criteria = json_encode($criteria);
            $url = $url."&criteria=".$criteria;
        }
        if (!empty($fields)) {
            $fields = json_encode($fields);
            $url = $url."&fields=".$fields;
        }
        if (!empty($sort)) {
            $sort = json_encode($sort);
            $url = $url."&sort=".$sort;
        }
      
        $this->curl->setUrl($url);
        $data = $this->curl->getCurl();
        
        $decode = json_decode($data, TRUE);
        if(isset($decode['error_code'])) {
            return $data;
        } else {
            return $decode['result'];
        }
    }
    
    /**
    * @return an array of assets.
    */
    function diffAssets ($id, $criteria = array(), $fields = array(), $sort = array(), $skip = NULL, $limit = NULL) {

        $token = $this->getOauthToken();
        $acc_tk = $token['access_token'];
      
        $url = $this->url."/diff-assets?oauth_token=".$acc_tk."&account=".$this->account."&id=".$id;
        if (!empty($criteria)) {
            $criteria = json_encode($criteria);
            $url = $url."&criteria=".$criteria;
        }
        if (!empty($fields)) {
            $fields = json_encode($fields);
            $url = $url."&fields=".$fields;
        }
        if (!empty($sort)) {
            $sort = json_encode($sort);
            $url = $url."&sort=".$sort;
        }
        if (!empty($skip)) {
            $url = $url."&skip=".$skip;
        }
        if (!empty($limit)) {
            $url = $url."&limit=".$limit;
        }
      
        $this->curl->setUrl($url);
        $data = $this->curl->getCurl();
      
        $decode = json_decode($data, TRUE);
        if(isset($decode['error_code'])) {
            return $data;
        } else {
            return $decode['result'];
        }
    }

    /**
    * @return an array of playlist.
    */
    function children ($id, $fields = array()) {

        $token = $this->getOauthToken();
        $acc_tk = $token['access_token'];

        $url = $this->url."/children?oauth_token=".$acc_tk."&account=".$this->account."&id=".$id;
        if (!empty($fields)) {
            $fields = json_encode($fields);
            $url = $url."&fields=".$fields;
        }

        $this->curl->setUrl($url);
        $data = $this->curl->getCurl();

        $decode = json_decode($data, TRUE);
        if(isset($decode['error_code'])) {
            return $data;
        } else {
            return $decode['result'];
        }
    }
    
    /**
    * @return an array of playlist.
    */
    function parents ($id, $fields = array()) {

        $token = $this->getOauthToken();
        $acc_tk = $token['access_token'];

        $url = $this->url."/parent?oauth_token=".$acc_tk."&account=".$this->account."&id=".$id;
        if (!empty($fields)) {
            $fields = json_encode($fields);
            $url = $url."&fields=".$fields;
        }

        $this->curl->setUrl($url);
        $data = $this->curl->getCurl();

        $decode = json_decode($data, TRUE);
        if(isset($decode['error_code'])) {
            return $data;
        } else {
            return $decode['result'];
        }
    }
    
    /**
     * @return an array of Playlist
     */
    function roots($fields = array(), $sort = array()){
        
        $token = $this->getOauthToken();
        $acc_tk = $token['access_token'];
        
        $url = $this->url."/roots?oauth_token=".$acc_tk."&account=".$this->account;
        if (!empty($fields)) {
            $fields = json_encode($fields);
            $url = $url."&fields=".$fields;
        }
        if (!empty($sort)) {
            $sort = json_encode($sort);
            $url = $url."&sort=".$sort;
        }         

        $this->curl->setUrl($url);
        $data = $this->curl->getCurl();
        
        $decode = json_decode($data, TRUE);
        if (isset($decode['error_code'])) {
            return $data;
        } else {
            return $decode['result'];
        }
    }
    
    /**
     * @return True || False
     */
    function splash($id, $filename) {

        $token = $this->getOauthToken();
        $acc_tk = $token['access_token'];

        $url = $this->url . "/splash/" . $id;
        $param = array("oauth_token" => $acc_tk, "account" => $this->account, "filename" => $filename);

        $this->curl->setParam($param);
        $this->curl->setUrl($url);
        $data = $this->curl->postCurl();

        $decode = json_decode($data, TRUE);
        if(isset($decode['error_code'])) {
            return $data;
        } else {
            return (bool)$decode['result'];
        }
    }
}

