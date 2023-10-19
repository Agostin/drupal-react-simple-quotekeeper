<?php

  namespace Drupal\quotes_rest_api\Plugin\rest\resource;

  use Drupal\rest\Plugin\ResourceBase;
  use Drupal\rest\ResourceResponse;

  use GuzzleHttp\Client;
  use GuzzleHttp\Exception\RequestException;

  /**
   * Provides a Quotes Resource
   *
   * @RestResource(
   *   id = "quotes_resource",
   *   label = @Translation("Quotes Resource"),
   *   uri_paths = {
   *     "canonical" = "/quotes_rest_api/quotes_resource"
   *   }
   * )
   */
  class QuotesResource extends ResourceBase {

    /**
     * Responds to entity GET requests.
     * @return \Drupal\rest\ResourceResponse
     */
    public function get($limit = 10) {
      // Fetch a maximum of 50 quotes each request
      if ($limit > 50) $limit = 50;
      else if ($limit < 1) $limit = 1;

      try {
        $client = new Client();
        $guzzleResponse = $client->get("https://api.quotable.io/quotes/random?limit=$limit");

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
