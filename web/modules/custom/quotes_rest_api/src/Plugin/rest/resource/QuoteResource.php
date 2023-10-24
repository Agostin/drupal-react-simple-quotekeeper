<?php

namespace Drupal\quotes_rest_api\Plugin\rest\resource;

use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;

use Symfony\Component\HttpFoundation\Request;

/**
 * Provides a Quote Resource
 *
 * @RestResource(
 *   id = "quote_resource",
 *   label = @Translation("Quote Resource"),
 *   uri_paths = {
 *     "canonical" = "/api/quotes",
 *     "create" = "/api/quote/new"
 *   }
 * )
 */
class QuoteResource extends ResourceBase {
  /**
   * Responds to entity GET requests.
   * @return \Drupal\rest\ResourceResponse
   */
   public function get() {
    $query = \Drupal::database()->query("SELECT id, content, author FROM {quotes} ORDER BY id DESC");
    $result = $query->fetchAll();
    $response = ['content' => json_encode($result)];

    return new ResourceResponse($response);
  }

  /**
   * Responds to entity POST requests.
   * @return \Drupal\rest\ResourceResponse
   */
  public function post(Request $request) {
    $data = json_decode($request->getContent());

    $result = \Drupal::database()
      ->insert('quotes')
      ->fields([
        'author' => $data->author,
        'content' => $data->content,
      ])
      ->execute();

    return new ResourceResponse(['content' => $response]);
  }

  /**
   * Responds to entity DELETE requests.
   * @return \Drupal\rest\ResourceResponse
   */
  public function delete() {}
}
