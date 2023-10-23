<?php

namespace Drupal\quotes_rest_api\Plugin\rest\resource;

use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;

/**
 * Provides a Demo Resource
 *
 * @RestResource(
 *   id = "quote_resource",
 *   label = @Translation("Demo Resource"),
 *   uri_paths = {
 *     "canonical" = "/quotes_rest_api/demo_resource"
 *   }
 * )
 */
class QuoteResource extends ResourceBase {
/**
   * Responds to entity GET requests.
   * @return \Drupal\rest\ResourceResponse
   */
  public function get() {
    $response = ['message' => 'Hello, this is a rest service'];
    return new ResourceResponse($response);
  }

  /**
   * Responds to entity POST requests.
   * @return \Drupal\rest\ResourceResponse
   */
  // public function post() {}

  /**
   * Suggests random quotes.
   * @return \Drupal\rest\ResourceResponse
   */
  public function getRandomQuote() {
    try {
      $client = new Client();
      $guzzleResponse = $client->get("https://type.fit/api/quotes");

      if ($guzzleResponse->getStatusCode() == 200) {
        return new ResourceResponse(['content' => json_decode($guzzleResponse->getBody(), true)]);
      }
    } catch (RequestException $e) {
      return new ResourceResponse(['error' => 'Oops! Something went wrong']);
    } catch(Exception $e) {
      return new ResourceResponse(['error' => 'Oops! Something went wrong']);
    }
  }
}
