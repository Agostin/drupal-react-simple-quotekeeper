<?php

namespace Drupal\api_connection\Event;

use Drupal\Component\EventDispatcher\Event;

/**
 * Definition for event to get environments for api connections.
 */
class ApiConnectionEnvironmentEvent extends Event {

  /**
   * The available environments.
   *
   * @var array
   */
  protected $environments;

  /**
   * ApiConnectionEnvironmentEvent constructor.
   *
   * @param array $environments
   *   The list of environments to extend.
   */
  public function __construct(array $environments) {
    $this->environments = $environments;
  }

  /**
   * Add an environment to the list.
   *
   * @param string $id
   *   The internal ID / key of the environment.
   * @param string $label
   *   The human-readable name of the environment.
   */
  public function addEnvironment(string $id, string $label) {
    $this->environments[$id] = $label;
  }

  /**
   * Get a list of environments.
   *
   * @return array
   *   The list of environments for api connections.
   */
  public function getEnvironments(): array {
    return $this->environments;
  }

}
