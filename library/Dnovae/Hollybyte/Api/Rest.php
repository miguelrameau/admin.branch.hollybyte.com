<?php

require_once 'Dnovae/Hollybyte/Api/Curl.php';

abstract class Dnovae_Hollybyte_Api_Rest {

    protected $curl = NULL;
    protected $url = NULL;
    protected $clientId = NULL;
    protected $secret = NULL;
    protected $account = NULL;
    protected $oauthToken = NULL;

    /**
     *
     */
    function __construct($clientId, $secret, $url, $account =NULL) {
        $this->curl = new Dnovae_Hollybyte_Api_Curl();
        $this->clientId = $clientId;
        $this->secret = $secret;
        $this->url = $url;
        if(!empty($account)) {
            $this->account = $account;
        }
    }

    /**
     * @return an array of assets.
     */
    function find($criteria = array(), $fields = array(), $sort = array(), $skip =NULL, $limit =NULL) {

        $token = $this->getOauthToken();
        $acc_tk = $token['access_token'];

        if(empty($this->account)) {
            $url = $this->url."?oauth_token=".$acc_tk;
        } else {
            $url = $this->url."?oauth_token=".$acc_tk."&account=".$this->account;
        }

        if(!empty($criteria)) {
            $criteria = json_encode($criteria);
            $url = $url."&criteria=".$criteria;
        }
        if(!empty($fields)) {
            $fields = json_encode($fields);
            $url = $url."&fields=".$fields;
        }
        if(!empty($sort)) {
            $sort = json_encode($sort);
            $url = $url."&sort=".$sort;
        }
        if(!empty($skip)) {
            $url = $url."&skip=".$skip;
        }
        if(!empty($limit)) {
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
     * @return an array with the object.
     */
    function findById($id, $fields = array()) {

        $token = $this->getOauthToken();
        $acc_tk = $token['access_token'];

        if(empty($this->account)) {
            $url = $this->url."?oauth_token=".$acc_tk."&id=".$id;
        } else {
            $url = $this->url."?oauth_token=$acc_tk&account=$this->account&id=$id";
        }

        if(!empty($fields)) {
            $fields = json_encode($fields);
            $url = $url."&fields=".$fields;
        }

        $this->curl->setUrl($url);
        $data = $this->curl->getCurl();

        $decode = json_decode($data, TRUE);
        if(isset($decode['error_code'])) {
            return $data;
        } else {
            return $decode;
        }
    }

    /**
     * @return an array with the object.
     */
    function create($input) {

        $token = $this->getOauthToken();
        $acc_tk = $token['access_token'];

        $encode = json_encode($input);

        if(empty($this->account)) {
            $param = array("oauth_token" => $acc_tk, "data" => $encode);
        } else {
            $param = array("oauth_token" => $acc_tk, "account" => $this->account, "data" => $encode);
        }

        $this->curl->setUrl($this->url);
        $this->curl->setParam($param);
        $data = $this->curl->postCurl();

        $decode = json_decode($data, TRUE);
        if(isset($decode['error_code'])) {
            return $data;
        } else {
            return $decode;
        }
    }

    /**
     * @return an array with the object.
     */
    function update($id, $input) {

        $token = $this->getOauthToken();
        $acc_tk = $token['access_token'];

        $encode = json_encode($input);

        if(empty($this->account)) {
            $param = array("oauth_token" => $acc_tk, "id" => $id, "data" => $encode);
        } else {
            $param = array("oauth_token" => $acc_tk, "account" => $this->account, "id" => $id, "data" => $encode);
        }

        $this->curl->setUrl($this->url);
        $this->curl->setParam($param);
        $data = $this->curl->putCurl(strlen($encode));

        $decode = json_decode($data, TRUE);
        if(isset($decode['error_code'])) {
            return $data;
        } else {
            return $decode;
        };
    }

    /**
     * @return True || False
     */
    function delete($id) {

        $token = $this->getOauthToken();
        $acc_tk = $token['access_token'];

        if(empty($this->account)) {
            $url = $this->url."?oauth_token=".$acc_tk."&id=".$id;
        } else {
            $url = $this->url."?oauth_token=".$acc_tk."&account=".$this->account."&id=".$id;
        }
        
        $this->curl->setUrl($url);
        $data = $this->curl->deleteCurl();
        

        $decode = json_decode($data, TRUE);
        if(isset($decode['error_code'])) {
            return $data;
        } else {
            return (bool)$decode['result'];
        }
    }

    /**
     * @return True || False
     */
    function modify($id, $input) {

        $token = $this->getOauthToken();
        $acc_tk = $token['access_token'];

        $encode = json_encode($input);

        if(empty($this->account)) {
            $param = array('oauth_token' => $acc_tk, 'data' => $encode);
        } else {
            $param = array('oauth_token' => $acc_tk, 'account' => $this->account, 'data' => $encode);
        }
        $url = $this->url."/modify/".$id;

        $this->curl->setUrl($url);
        $this->curl->setParam($param);
        $data = $this->curl->putCurl(strlen($encode));

        $decode = json_decode($data, TRUE);
        if(isset($decode['error_code'])) {
            return $data;
        } else {
            return (bool)$decode['result'];
        }
    }

    /**
     * @return True || False
     */
    function exists($id) {

        $token = $this->getOauthToken();
        $acc_tk = $token['access_token'];

        if(empty($this->account)) {
            $url = $this->url."/exists/".$id."?oauth_token=".$acc_tk;
        } else {
            $url = $this->url."/exists/$id?oauth_token=".$acc_tk."&account=".$this->account;
        }

        $this->curl->setUrl($url);
        $data = $this->curl->getCurl();

        $decode = json_decode($data, TRUE);
        if(isset($decode['error_code'])) {
            return $data;
        } else {
            return (bool)$decode['result'];
        }
    }

    /**
     * @return an integer.
     */
    function count($criteria = array(), $skip =NULL, $limit =NULL) {

        $token = $this->getOauthToken();
        $acc_tk = $token['access_token'];

        if(empty($this->account)) {
            $url = $this->url."/count?oauth_token=".$acc_tk;
        } else {
            $url = $this->url."/count?oauth_token=".$acc_tk."&account=".$this->account;
        }
        if(!empty($criteria)) {
            $criteria = json_encode($criteria);
            $url = $url."&criteria=".$criteria;
        }
        if(!empty($skip)) {
            $url = $url."&skip=".$skip;
        }
        if(!empty($limit)) {
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
     * @return an integer.
     */
    function version($id) {

        $token = $this->getOauthToken();
        $acc_tk = $token['access_token'];

        if(empty($this->account)) {
            $url = $this->url."/version/".$id."?oauth_token=".$acc_tk."&account=".$this->account;
        } else {
            $url = $this->url."/version/".$id."?oauth_token=".$acc_tk."&account=".$this->account;
        }

        $this->curl->setUrl($url);
        $data = $this->curl->getCurl();

        $decode = json_decode($data, TRUE);
        if(isset($decode['error_code'])) {
            return $data;
        } else {
            return $decode;
        }
    }

    /**
     * 
     */
    function getOauthToken() {
        if (empty($this->oautToken)) {
            if (isset($_SESSION['HOLLYBYTE_API_OAUTH_TOKEN'])) {
                $this->oauthToken = $_SESSION['HOLLYBYTE_API_OAUTH_TOKEN'];
            } else {
                $this->oauthToken = $this->curl->oauthToken($this->clientId, $this->secret);
                $_SESSION['HOLLYBYTE_API_OAUTH_TOKEN'] =  $this->oauthToken;
                return $this->oauthToken;
            }
        }
        if ($this->oauthToken['expires'] > (time() + 10)) {
        } else {
            $this->oauthToken = $this->curl->oauthToken($this->clientId, $this->secret);
            $_SESSION['HOLLYBYTE_API_OAUTH_TOKEN'] =  $this->oauthToken;
        }
        return $this->oauthToken;
    }
}
