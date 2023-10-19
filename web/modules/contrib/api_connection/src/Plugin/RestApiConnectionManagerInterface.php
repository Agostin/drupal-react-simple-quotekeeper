<?php

namespace Drupal\api_connection\Plugin;

use Drupal\Component\Plugin\Discovery\CachedDiscoveryInterface;
use Drupal\Component\Plugin\PluginManagerInterface;
use Drupal\Core\Cache\CacheableDependencyInterface;

/**
 * Interface for the RestApiConnectionManager service.
 */
interface RestApiConnectionManagerInterface extends PluginManagerInterface, CachedDiscoveryInterface, CacheableDependencyInterface {}
