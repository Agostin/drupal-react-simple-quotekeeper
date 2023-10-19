<?php

namespace Drupal\api_connection\Annotation;

use Drupal\Component\Annotation\Plugin;

/**
 * General logic to define ApiConnection plugin annotations.
 */
abstract class ApiConnection extends Plugin {


  /**
   * The plugin ID.
   *
   * @var string
   */
  public $id;

  /**
   * The label of the plugin.
   *
   * @var \Drupal\Core\Annotation\Translation
   *
   * @ingroup plugin_translatable
   */
  public $label;

  /**
   * Whether this API connection is activated or not.
   *
   * @var bool
   *   Boolean indicating of API connection is activated.
   */
  public $activated = TRUE;

  /**
   * The web service URLs, per environment.
   *
   * Default array keys are "dev", "test", "live".
   * See ApiConnectionEnvironment service.
   *
   * @var array
   *   List of web service base URLs per environment.
   */
  public $urls = [];

}
