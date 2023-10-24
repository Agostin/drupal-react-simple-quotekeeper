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

  protected $table_name = 'quotes';

  /**
   * Responds to entity GET requests.
   * @return \Drupal\rest\ResourceResponse
   */
   public function get() {
    $query = \Drupal::database()->query("SELECT id, content, author FROM {$this->table_name} ORDER BY id DESC");
    $result = $query->fetchAll();
    $response = ['content' => json_encode($result)];

    $build = array(
      '#cache' => array(
        'max-age' => 0,
      ),
    );

    return (new ResourceResponse($response))->addCacheableDependency($build);
  }

  /**
   * Responds to entity POST requests.
   * @return \Drupal\rest\ResourceResponse
   */
  public function post(Request $request) {
    $data = json_decode($request->getContent());

    $result = \Drupal::database()
      ->insert($this->table_name)
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
  public function delete(Request $request) {
    $data = json_decode($request->getContent());

    $num_deleted = \Drupal::database()
      ->delete($this->table_name)
      ->condition('id', $data->id)
      ->execute();

    return new ResourceResponse(['delete_count' => $num_deleted]);
  }
}
