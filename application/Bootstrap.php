<?php

class Bootstrap extends Zend_Application_Bootstrap_Bootstrap
{

    /**
     *
     */
    protected function _initSession()
    {
        Zend_Session::start();
    }

    /**
     *
     */
    protected function _initLog()
    {
        if ($this->hasPluginResource('Log')) {
            $resource = $this->getPluginResource('Log');
            $log = $resource->getLog();
            Zend_Registry::set('log', $log);
        }
    }

    /**
     *
     */
    protected function _initConfig() {
        $config = new Zend_Config_Ini(APPLICATION_PATH . '/configs/config.ini', APPLICATION_ENV);
        Zend_Registry::set('config', $config);
    }

    /**
     *
     */
    protected function _initCache() {
        $config = Zend_Registry::get('config');
        $server = $config->memcached->server;

    	$frontendName = 'Core';
    	$backendName = 'Memcached';
    	$frontendOptions = array (
    		'lifetime' => 7200,
    		'automatic_serialization' => true);
    	$backendOptions = array(
            'servers' => array(
                array('host' => $server, 'port' => 11211,
                	'persistent' => true, 'weight' => 1, 'timeout' => 5,
                	'retry_interval' => 15, 'status' => true),
            ),
            'compression' => true,
        );
        // getting a Zend_Cache_Core object
        $coreCache = Zend_Cache::factory($frontendName, $backendName, $frontendOptions,$backendOptions);
        Zend_Registry::set('coreCache', $coreCache);
    }

    /**
     *
     */
    protected function _initAuth() {
        $autoLoader = Zend_Loader_Autoloader::getInstance();

        $resourceLoader = new Zend_Loader_Autoloader_Resource(array(
                    'basePath' => APPLICATION_PATH . '/../library',
                    'namespace' => 'My_',
                ));

        $resourceLoader->addResourceType('openidextension', 'openid/extension/', 'OpenId_Extension');
        $resourceLoader->addResourceType('authAdapter', 'auth/adapter', 'Auth_Adapter');

        $autoLoader->pushAutoloader($resourceLoader);
    }

    /**
     *
     */
    protected function _initAppKeysToRegistry() {
         $appkeys = new Zend_Config_Ini(APPLICATION_PATH . '/configs/appkeys.ini');
         Zend_Registry::set('keys', $appkeys);
     }
}

