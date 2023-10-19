<?php

namespace Drupal\api_connection_example\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Controller to display example data from REQ|RES service.
 */
class ReqResController extends ControllerBase {

  /**
   * The API connection plugin.
   *
   * @var \Drupal\api_connection_example\Plugin\RestApiConnection\ReqRes
   */
  protected $reqResConnection;

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container): ReqResController {
    $instance = parent::create($container);
    $instance->reqResConnection = $container->get('plugin.manager.rest_api_connection')->createInstance('req_res');
    return $instance;
  }

  /**
   * Example login logic via REQ|RES API.
   */
  public function login(): array {
    $build = [];
    if ($token = $this->reqResConnection->login('eve.holt@reqres.in', 'cityslicka')) {
      $build[] = [
        '#markup' => $this->t('Login successful! Token: @token', [
          '@token' => $token,
        ]),
      ];
    }
    else {
      $build[] = [
        '#markup' => $this->t('Login failed...'),
      ];
    }
    return $build;
  }

  /**
   * Renders example data from the REQ|RES API.
   *
   * @param int $id
   *   Optional user ID to get details for.
   *
   * @return array
   *   Render array.
   */
  public function userDetail($id = 1): array {
    $build = [];
    $user_data = $this->reqResConnection->getUser((int) $id);
    if (!empty($user_data)) {
      $build[] = [
        '#markup' => $this->t('Name for user @id: @first @last', [
          '@id' => $id,
          '@first' => $user_data['data']['first_name'],
          '@last' => $user_data['data']['last_name'],
        ]),
      ];
    }

    return $build;
  }

}
