<?php

require_once "Dnovae/Hollybyte/Api/Account.php";
require_once "Dnovae/Hollybyte/Api/User.php";
require_once "Dnovae/Hollybyte/Api/Client.php";
require_once "Dnovae/Hollybyte/Api/Acl.php";
require_once "Dnovae/Hollybyte/Api/Media.php";
require_once "Dnovae/Hollybyte/Api/Asset.php";
require_once "Dnovae/Hollybyte/Api/Settings.php";
require_once "Dnovae/Hollybyte/Api/Playlist.php";
require_once "Dnovae/Hollybyte/Api/Player.php";
require_once "Dnovae/Hollybyte/Api/Connector.php";
require_once "Dnovae/Hollybyte/Api/Site.php";
require_once "Dnovae/Hollybyte/Api/Process.php";
require_once "Dnovae/Hollybyte/Api/Upload.php";

/**
 *
 */
class Dnovae_Hollybyte_Admin_Registry {

    /**
     *
     */
    public static function getUploadService($account) {
        $serviceName = "uploadService";
        if (Zend_Registry::isRegistered ($serviceName)) {
            return Zend_Registry::get ($serviceName);
        } else {
            $config = Zend_Registry::get ('config');
            $clientId = $config->oauth->client->id;
            $clientSecret = $config->oauth->client->secret;
            $service = new Dnovae_Hollybyte_Api_Upload($clientId, $clientSecret, $account);
            Zend_Registry::set ($serviceName, $service);
            return $service;
        }
    }

    /**
     *
     */
    public static function getAccountService() {
        $serviceName = "accountService";
        if (Zend_Registry::isRegistered ($serviceName)) {
            return Zend_Registry::get ($serviceName);
        } else {
            $config = Zend_Registry::get ('config');
            $clientId = $config->oauth->client->id;
            $clientSecret = $config->oauth->client->secret;
            $service = new Dnovae_Hollybyte_Api_Account($clientId, $clientSecret);
            Zend_Registry::set ($serviceName, $service);
            return $service;
        }
    }

	/**
	 *
	 */
	public static function getUserService() {
		$serviceName = "userService";
		if (Zend_Registry::isRegistered ($serviceName)) {
			return Zend_Registry::get ($serviceName);
		} else {
		    $config = Zend_Registry::get ('config');
		    $clientId = $config->oauth->client->id;
		    $clientSecret = $config->oauth->client->secret;
			$service = new Dnovae_Hollybyte_Api_User($clientId, $clientSecret);
			Zend_Registry::set ($serviceName, $service);
			return $service;
		}
	}

	/**
	 *
	 */
	public static function getClientService() {
		$serviceName = "clientService";
		if (Zend_Registry::isRegistered ($serviceName)) {
			return Zend_Registry::get ($serviceName);
		} else {
		    $config = Zend_Registry::get ('config');
		    $clientId = $config->oauth->client->id;
		    $clientSecret = $config->oauth->client->secret;
			$service = new Dnovae_Hollybyte_Api_Client($clientId, $clientSecret);
			Zend_Registry::set ($serviceName, $service);
			return $service;
		}
	}

	/**
	 *
	 */
	public static function getAcl() {
		$serviceName = "aclService";
		if (Zend_Registry::isRegistered ($serviceName)) {
			return Zend_Registry::get ($serviceName);
		} else {
		    $config = Zend_Registry::get ('config');
		    $clientId = $config->oauth->client->id;
		    $clientSecret = $config->oauth->client->secret;
			$service = new Dnovae_Hollybyte_Api_Acl($clientId, $clientSecret);
			Zend_Registry::set ($serviceName, $service);
			return $service;
		}
	}

    /**
     *
     */
    public static function getMediaService() {
        $serviceName = "mediaService";
        if (Zend_Registry::isRegistered ($serviceName)) {
            return Zend_Registry::get ($serviceName);
        } else {
            $config = Zend_Registry::get ('config');
            $clientId = $config->oauth->client->id;
            $clientSecret = $config->oauth->client->secret;
            $service = new Dnovae_Hollybyte_Api_Media($clientId, $clientSecret);
            Zend_Registry::set ($serviceName, $service);
            return $service;
        }
    }

    /**
     *
     */
    public static function getSettingsService($account) {
        $serviceName = "settingsService";
        if (Zend_Registry::isRegistered ($serviceName)) {
            return Zend_Registry::get ($serviceName);
        } else {
            $config = Zend_Registry::get ('config');
            $clientId = $config->oauth->client->id;
            $clientSecret = $config->oauth->client->secret;
            $service = new Dnovae_Hollybyte_Api_Settings($clientId, $clientSecret, $account);
            Zend_Registry::set ($serviceName, $service);
            return $service;
        }
    }

	/**
	 *
	 */
	public static function getAssetService($account) {
		$serviceName = "assetService";
		if (Zend_Registry::isRegistered ($serviceName)) {
			return Zend_Registry::get ($serviceName);
		} else {
		    $config = Zend_Registry::get ('config');
		    $clientId = $config->oauth->client->id;
		    $clientSecret = $config->oauth->client->secret;
			$service = new Dnovae_Hollybyte_Api_Asset($clientId, $clientSecret, $account);
			Zend_Registry::set ($serviceName, $service);
			return $service;
		}
	}

	/**
	 *
	 */
	public static function getPlaylistService($account) {
		$serviceName = "playlistService";
		if (Zend_Registry::isRegistered ($serviceName)) {
			return Zend_Registry::get ($serviceName);
		} else {
		    $config = Zend_Registry::get ('config');
		    $clientId = $config->oauth->client->id;
		    $clientSecret = $config->oauth->client->secret;
			$service = new Dnovae_Hollybyte_Api_Playlist($clientId, $clientSecret, $account);
			Zend_Registry::set ($serviceName, $service);
			return $service;
		}
	}

	/**
	 *
	 */
	public static function getPlayerService($account) {
		$serviceName = "playerService";
		if (Zend_Registry::isRegistered ($serviceName)) {
			return Zend_Registry::get ($serviceName);
		} else {
		    $config = Zend_Registry::get ('config');
		    $clientId = $config->oauth->client->id;
		    $clientSecret = $config->oauth->client->secret;
			$service = new Dnovae_Hollybyte_Api_Player($clientId, $clientSecret, $account);
			Zend_Registry::set ($serviceName, $service);
			return $service;
		}
	}

	/**
	 *
	 */
	public static function getConnectorService($account) {
		$serviceName = "connectorService";
		if (Zend_Registry::isRegistered ($serviceName)) {
			return Zend_Registry::get ($serviceName);
		} else {
		    $config = Zend_Registry::get ('config');
		    $clientId = $config->oauth->client->id;
		    $clientSecret = $config->oauth->client->secret;
			$service = new Dnovae_Hollybyte_Api_Connector($clientId, $clientSecret, $account);
			Zend_Registry::set ($serviceName, $service);
			return $service;
		}
	}

	/**
	 *
	 */
	public static function getSiteService($account) {
		$serviceName = "siteService";
		if (Zend_Registry::isRegistered ($serviceName)) {
			return Zend_Registry::get ($serviceName);
		} else {
		    $config = Zend_Registry::get ('config');
		    $clientId = $config->oauth->client->id;
		    $clientSecret = $config->oauth->client->secret;
			$service = new Dnovae_Hollybyte_Api_Site($clientId, $clientSecret, $account);
			Zend_Registry::set ($serviceName, $service);
			return $service;
		}
	}

	/**
	 *
	 */
	public static function getProcessService($account) {
		$serviceName = "processService";
		if (Zend_Registry::isRegistered ($serviceName)) {
			return Zend_Registry::get ($serviceName);
		} else {
		    $config = Zend_Registry::get ('config');
		    $clientId = $config->oauth->client->id;
		    $clientSecret = $config->oauth->client->secret;
			$service = new Dnovae_Hollybyte_Api_Process($clientId, $clientSecret, $account);
			Zend_Registry::set ($serviceName, $service);
			return $service;
		}
	}
}
