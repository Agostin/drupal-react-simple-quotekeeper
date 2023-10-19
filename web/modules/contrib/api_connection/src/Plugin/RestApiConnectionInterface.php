<?php

namespace Drupal\api_connection\Plugin;

/**
 * Defines an interface for REST API connection plugins.
 */
interface RestApiConnectionInterface extends ApiConnectionInterface {

  /**
   * Send request to the REST API.
   *
   * @param string $endpoint
   *   The endpoint on the API.
   * @param string $method
   *   The request method.
   * @param array $options
   *   Options for the request i.e body, header, ...
   * @param bool $return_response_object
   *   Whether to return the Response object, or the response body data.
   *
   * @return bool|array|\Psr\Http\Message\ResponseInterface|null
   *   Return response data or object.
   *
   * @throws \Drupal\api_connection\RestApiEnvironmentUrlException
   */
  public function sendRequest(string $endpoint, string $method, array $options = [], bool $return_response_object = FALSE);

}
