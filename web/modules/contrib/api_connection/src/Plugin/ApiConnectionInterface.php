<?php

namespace Drupal\api_connection\Plugin;

use Drupal\Component\Plugin\ConfigurableInterface;
use Drupal\Component\Plugin\PluginInspectionInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\Core\Plugin\PluginFormInterface;

/**
 * Defines an interface for API connection plugins.
 */
interface ApiConnectionInterface extends PluginInspectionInterface, ConfigurableInterface, PluginFormInterface, ContainerFactoryPluginInterface {

  /**
   * Get the current API connection environment.
   *
   * @return string|null
   *   The environment key.
   */
  public function getEnvironment(): ?string;

}
