<?php

namespace Drupal\api_connection\Plugin;

use Drupal\Core\Plugin\DefaultPluginManager;
use Drupal\Core\Cache\CacheBackendInterface;
use Drupal\Core\Extension\ModuleHandlerInterface;

/**
 * Provides the REST API connection plugin manager.
 */
class RestApiConnectionManager extends DefaultPluginManager implements RestApiConnectionManagerInterface {

  /**
   * Constructs a new RestApiConnectionManager object.
   *
   * @param \Traversable $namespaces
   *   An object that implements \Traversable which contains the root paths
   *   keyed by the corresponding namespace to look for plugin implementations.
   * @param \Drupal\Core\Cache\CacheBackendInterface $cache_backend
   *   Cache backend instance to use.
   * @param \Drupal\Core\Extension\ModuleHandlerInterface $module_handler
   *   The module handler to invoke the alter hook with.
   */
  public function __construct(\Traversable $namespaces, CacheBackendInterface $cache_backend, ModuleHandlerInterface $module_handler) {
    parent::__construct('Plugin/RestApiConnection', $namespaces, $module_handler, 'Drupal\api_connection\Plugin\RestApiConnectionInterface', 'Drupal\api_connection\Annotation\RestApiConnection');

    $this->alterInfo('api_connection_rest_api_connection_info');
    $this->setCacheBackend($cache_backend, 'api_connection_rest_api_connection_plugins');
  }

}
