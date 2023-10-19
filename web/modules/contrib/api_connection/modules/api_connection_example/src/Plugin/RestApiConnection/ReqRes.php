<?php

namespace Drupal\api_connection_example\Plugin\RestApiConnection;

use Drupal\api_connection\Plugin\RestApiConnectionBase;
use GuzzleHttp\RequestOptions;

/**
 * REST API connection for the ReqRes example service.
 *
 * @RestApiConnection(
 *   id = "req_res",
 *   label = @Translation("REQ|RES API"),
 *   urls = {
 *     "dev" = "https://reqres.in",
 *     "test" = "https://reqres.in",
 *     "live" = "https://reqres.in"
 *   }
 * )
 */
class ReqRes extends RestApiConnectionBase {

  /**
   * Get user data for a given user ID from REQ|RES API.
   *
   * @param int $id
   *   The user ID.
   *
   * @return array
   *   User data from REQ|RES API.
   *
   * @throws \Drupal\api_connection\RestApiEnvironmentUrlException
   */
  public function getUser(int $id): array {
    return $this->sendRequest("api/users/{$id}", "GET");
  }

  /**
   * Login to REQ|RES API.
   *
   * @param string $username
   *   The user name to log in with.
   * @param string $password
   *   The password to log in with.
   *
   * @return bool|string
   *   The login token, or FALSE if login unsuccessful.
   *
   * @throws \Drupal\api_connection\RestApiEnvironmentUrlException
   */
  public function login(string $username, string $password) {
    $options = [
      RequestOptions::BODY => [
        'email' => $username,
        'password' => $password,
      ],
    ];
    $response = $this->sendRequest('api/login', "POST", $options);
    if (isset($response['token'])) {
      return $response['token'];
    }
    return FALSE;
  }

}
