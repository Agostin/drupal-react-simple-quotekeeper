<?php

namespace Drupal\api_connection\Form;

use Drupal\api_connection\ApiConnectionEnvironmentInterface;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Settings form for the API Connection module.
 */
class ApiConnectionSettingsForm extends ConfigFormBase {

  /**
   * The API Connection environment service.
   *
   * @var \Drupal\api_connection\ApiConnectionEnvironmentInterface
   */
  protected $apiConnectionEnvironment;

  /**
   * ApiConnectionSettingsForm constructor.
   *
   * @param \Drupal\Core\Config\ConfigFactoryInterface $config_factory
   *   The factory for configuration objects.
   * @param \Drupal\api_connection\ApiConnectionEnvironmentInterface $api_connection_environment
   *   The API Connection environment service.
   */
  public function __construct(ConfigFactoryInterface $config_factory, ApiConnectionEnvironmentInterface $api_connection_environment) {
    parent::__construct($config_factory);
    $this->apiConnectionEnvironment = $api_connection_environment;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('config.factory'),
      $container->get('api_connection.environment')
    );
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames(): array {
    return [
      'api_connection.settings',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId(): string {
    return 'api_connection_settings_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state): array {
    $config = $this->config('api_connection.settings');

    $form['enable_logging'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Enable logging'),
      '#description' => $this->t('Enable API call logging'),
      '#default_value' => $config->get('enable_logging'),
    ];

    $form['environment'] = [
      '#type' => 'radios',
      '#title' => $this->t('Environment'),
      '#description' => $this->t('Specify the current environment'),
      '#default_value' => $config->get('environment'),
      '#options' => $this->apiConnectionEnvironment->getEnvironments(),
      '#required' => TRUE,
    ];
    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    parent::submitForm($form, $form_state);

    $this->config('api_connection.settings')
      ->set('enable_logging', $form_state->getValue('enable_logging'))
      ->set('environment', $form_state->getValue('environment'))
      ->save();
  }

}
