<?php

namespace Drupal\api_connection;

/**
 * Interface for API Connection environments service.
 */
interface ApiConnectionEnvironmentInterface {

  /**
   * Get the available environments.
   *
   * @return array
   *   List of available environments.
   */
  public function getEnvironments(): array;

}
