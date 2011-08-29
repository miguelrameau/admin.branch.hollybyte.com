<?php

require_once 'Dnovae/Hollybyte/Api/Rest.php';

class Dnovae_Hollybyte_Api_Account extends Dnovae_Hollybyte_Api_Rest {
    
    protected $url = "https://api.hollybyte.com/account";
    
    /**
    *
    */
    function __construct($user, $secret) {
        parent::__construct($user, $secret, $this->url);
    }
    
}

