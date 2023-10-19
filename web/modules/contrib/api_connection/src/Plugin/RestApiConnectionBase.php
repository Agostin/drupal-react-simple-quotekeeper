<?php

namespace Drupal\api_connection\Plugin;

use Drupal\Component\Serialization\Json;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Http\ClientFactory;
use Drupal\Core\Logger\LoggerChannelFactoryInterface;
use Drupal\api_connection\RestApiEnvironmentUrlException;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\MessageFormatter;
use GuzzleHttp\Middleware;
use GuzzleHttp\RequestOptions;
use Psr\Http\Message\ResponseInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Base class for REST API connection plugins.
 */
abstract class RestApiConnectionBase extends ApiConnectionBase implements RestApiConnectionInterface {

  /**
   * The HTTP client.
   *
   * @var \GuzzleHttp\Client
   */
  protected $client;

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('logger.factory'),
      $container->get('config.factory'),
      $container->get('http_client_factory')
    );
  }

  /**
   * RestApiConnectionBase constructor.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin ID for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param \Drupal\Core\Logger\LoggerChannelFactoryInterface $logger_factory
   *   The logger factory.
   * @param \Drupal\Core\Config\ConfigFactoryInterface $config_factory
   *   The config factory.
   * @param \Drupal\Core\Http\ClientFactory $client_factory
   *   The http client factory.
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, LoggerChannelFactoryInterface $logger_factory, ConfigFactoryInterface $config_factory, ClientFactory $client_factory) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $logger_factory, $config_factory);
    $client_config = [];
    if ((bool) $this->config->get('enable_logging') !== FALSE) {
      // Add logging middleware for API calls.
      // See https://michaelstivala.com/logging-guzzle-requests/
      $client_config['handler'] = $this->createLoggingHandlerStack([
        '{method} {uri} HTTP/{version} {req_body}',
        'RESPONSE: {code} - {res_body}',
      ]);
    }
    $this->client = $client_factory->fromOptions($client_config);
    $this->setConfiguration($this->getConfiguration());
  }

  /**
   * {@inheritdoc}
   */
  public function sendRequest(string $endpoint, string $method, array $options = [], bool $return_response_object = FALSE) {
    if ((bool) $this->pluginDefinition['activated'] !== TRUE) {
      return $return_response_object ? NULL : FALSE;
    }

    if (isset($options[RequestOptions::BODY])) {
      $options[RequestOptions::BODY] = Json::encode($options[RequestOptions::BODY]);
    }

    if (!isset($options[RequestOptions::HEADERS])) {
      $options[RequestOptions::HEADERS] = [];
    }
    if (!isset($options[RequestOptions::HEADERS]['Content-Type'])) {
      $options[RequestOptions::HEADERS]['Content-Type'] = 'application/json';
    }

    $current_environment = $this->getEnvironment();
    if (!isset($this->pluginDefinition['urls'][$current_environment])) {
      throw new RestApiEnvironmentUrlException($current_environment);
    }
    $base_url = $this->pluginDefinition['urls'][$current_environment];

    if ($response = $this->handleRequest($method, $base_url . '/' . $endpoint, $options)) {
      $response_object = $this->handleResponse($response);
      if ($return_response_object) {
        return $response_object;
      }
      else {
        $body = Json::decode((string) $response->getBody());
        if (empty($body)) {
          // If endpoint returns no body, but we got a 200 status code, return
          // TRUE, to indicate request was successful.
          return TRUE;
        }
        return $body;
      }
    }

    return $return_response_object ? NULL : FALSE;
  }

  /**
   * Handle the request to the API.
   *
   * @param string $method
   *   The request method.
   * @param string $endpoint_url
   *   The full API endpoint URL.
   * @param array $options
   *   Options for the request i.e body, header, ...
   *
   * @return bool|mixed|\Psr\Http\Message\ResponseInterface
   *   The response object.
   */
  protected function handleRequest(string $method, string $endpoint_url, array $options) {
    // Try to send the request to the API.
    try {
      return $this->client->request($method, $endpoint_url, $options);
    }
    catch (GuzzleException $e) {
      $this->logger->error($e->getMessage());
    }
    return FALSE;
  }

  /**
   * Default handling for the response from the API.
   *
   * @param \Psr\Http\Message\ResponseInterface $response
   *   The response object to handle.
   *
   * @return \Psr\Http\Message\ResponseInterface
   *   The response object.
   */
  protected function handleResponse(ResponseInterface $response): ResponseInterface {
    if (!$response->getStatusCode() == 200) {
      $this->logger->error((string) $response->getBody());
    }
    return $response;
  }

  /**
   * Create HandlerStack for Guzzle, to log requests and responses separately.
   *
   * @param array $message_formats
   *   Message formats to log.
   *
   * @return \GuzzleHttp\HandlerStack
   *   The Guzzle handler stack.
   */
  protected function createLoggingHandlerStack(array $message_formats): HandlerStack {
    $stack = HandlerStack::create();

    foreach ($message_formats as $message_format) {
      // We'll use unshift instead of push, to add the middleware to the bottom
      // of the stack, not the top.
      $stack->unshift(
        $this->createGuzzleLoggingMiddleware($message_format)
      );
    }

    return $stack;
  }

  /**
   * Create Guzzle middleware, to log requests to Drupal logger.
   *
   * @param string $message_format
   *   The message format to format log messages in.
   *
   * @return callable
   *   The callable logging middleware.
   */
  protected function createGuzzleLoggingMiddleware(string $message_format): callable {
    return Middleware::log(
      $this->logger,
      new MessageFormatter($message_format)
    );
  }

}
