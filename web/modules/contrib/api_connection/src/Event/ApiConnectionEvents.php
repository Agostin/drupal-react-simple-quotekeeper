<?php

namespace Drupal\api_connection\Event;

/**
 * Defines events for API Connection module.
 */
final class ApiConnectionEvents {

  /**
   * Event fired to gather available environments for api connections.
   *
   * @Event
   *
   * @see \Drupal\api_connection\Event\ApiConnectionEnvironmentEvent
   *
   * @var string
   */
  const ENVIRONMENT = 'api_connection.environment';

}
