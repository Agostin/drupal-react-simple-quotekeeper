<?php

namespace Drupal\api_connection;

use Drupal\api_connection\Event\ApiConnectionEnvironmentEvent;
use Drupal\api_connection\Event\ApiConnectionEvents;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;

/**
 * Provides logic for defining the available environments.
 */
class ApiConnectionEnvironment implements ApiConnectionEnvironmentInterface {

  use StringTranslationTrait;

  /**
   * The event dispatcher service.
   *
   * @var \Symfony\Component\EventDispatcher\EventDispatcherInterface
   */
  protected $eventDispatcher;

  /**
   * Environments constructor.
   *
   * @param \Symfony\Component\EventDispatcher\EventDispatcherInterface $event_dispatcher
   *   The event dispatcher service.
   */
  public function __construct(EventDispatcherInterface $event_dispatcher) {
    $this->eventDispatcher = $event_dispatcher;
  }

  /**
   * Get the available environments.
   *
   * @return array
   *   List of available environments.
   */
  public function getEnvironments(): array {
    $environments = [
      'dev' => $this->t('Development'),
      'test' => $this->t('Testing / staging'),
      'live' => $this->t('Live / production'),
    ];
    $event = new ApiConnectionEnvironmentEvent($environments);
    $this->eventDispatcher->dispatch($event, ApiConnectionEvents::ENVIRONMENT);
    return $event->getEnvironments();
  }

}
