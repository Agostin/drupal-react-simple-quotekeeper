<?php

namespace Drupal\quotes_rest_api\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;

class QuoteResourceController {

  /**
   * Returns an array of random quotes fetched from the Web.
   */
  public function getRandomQuotes() {
    try {
      $response = \Drupal::httpClient()->get("https://type.fit/api/quotes");
      $data = json_decode($response->getBody(), TRUE);

      return new JsonResponse(['content' => $data], 200);
    } catch (RequestException $e) {
      return new JsonResponse(['error' => 'Oops! Something went wrong'], 500);
    }
  }
}
