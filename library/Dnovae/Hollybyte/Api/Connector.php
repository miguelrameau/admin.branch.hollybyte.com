<?php

require_once 'Dnovae/Hollybyte/Api/Rest.php';

class Dnovae_Hollybyte_Api_Connector extends Dnovae_Hollybyte_Api_Rest {
    
    protected $url = "https://api.hollybyte.com/connector";
    
    /**
    *
    */
    function __construct($user, $secret, $account) {
        parent::__construct($user, $secret, $this->url, $account);
    }
}

