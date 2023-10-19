<?php

namespace Drupal\api_connection\Generator;

use Drupal\Console\Core\Generator\Generator;

/**
 * Drupal Console generator class for RestApiConnection plugin.
 *
 * @package Drupal\api_connection\Generator
 */
class RestApiConnectionGenerator extends Generator {

  /**
   * Generate RestApiConnection plugin.
   *
   * @param array $parameters
   *   Parameters for generator.
   */
  public function generate(array $parameters) {
    $module_path = $parameters['module_path'];
    $module_name = $parameters['module_name'];
    $machine_name = $parameters['machine_name'];
    $name = $parameters['name'];
    $dev_url = $parameters['dev-url'];
    $test_url = $parameters['test-url'];
    $live_url = $parameters['live-url'];
    $class_name = str_replace('_', '', ucwords($machine_name, '_'));

    $installation_dir = ($module_path == '/' ? '' : $module_path) . '/src/Plugin/RestApiConnection/';
    if (file_exists($installation_dir)) {
      if (!is_dir($installation_dir)) {
        throw new \RuntimeException(
          sprintf(
            'Unable to generate the RestApiConnection plugin as the target directory "%s" exists but is a file.',
            realpath($installation_dir)
          )
        );
      }
      if (!is_writable($installation_dir)) {
        throw new \RuntimeException(
          sprintf(
            'Unable to generate the RestApiConnection plugin as the target directory "%s" is not writable.',
            realpath($installation_dir)
          )
        );
      }
      if (file_exists($installation_dir . $class_name . '.php')) {
        throw new \RuntimeException(
          sprintf(
            'Unable to generate the RestApiConnection plugin as the target file "%s" already exists.',
            realpath($installation_dir . $class_name . '.php')
          )
        );
      }
    }

    $this->addSkeletonDir(__DIR__ . '/../../console/templates');

    // Create the RestApiConnection plugin file.
    $this->renderFile(
      'src/Plugin/RestApiConnection/restApiConnection.php.twig',
      $installation_dir . $class_name . '.php',
      [
        'module_name' => $module_name,
        'machine_name' => $machine_name,
        'class_name' => $class_name,
        'name' => $name,
        'dev_url' => $dev_url,
        'test_url' => $test_url,
        'live_url' => $live_url,
      ]
    );
  }

}
