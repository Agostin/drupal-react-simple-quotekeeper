<?php

namespace Drupal\api_connection;

/**
 * Represents an exception that occurred with a given environment.
 */
class RestApiEnvironmentUrlException extends \Exception {

  /**
   * Constructs an RestApiEnvironmentUrlException.
   *
   * @param string $environment
   *   The environment throwing an exception.
   */
  public function __construct($environment) {
    $message = sprintf('No URL was found for the %s environment.', $environment);
    parent::__construct($message);
  }

}
