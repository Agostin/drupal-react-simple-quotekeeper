<?php

namespace Drupal\api_connection\Command\Generate;

use Drupal\Console\Annotations\DrupalCommand;
use Drupal\Console\Command\Shared\ModuleTrait;
use Drupal\Console\Core\Command\ContainerAwareCommand;
use Drupal\Console\Core\Command\Shared\CommandTrait;
use Drupal\Console\Core\Generator\Generator;
use Drupal\Console\Core\Utils\ChainQueue;
use Drupal\Console\Core\Utils\StringConverter;
use Drupal\Console\Extension\Manager;
use Drupal\Console\Utils\Validator;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * Drupal console command to generate a RestApiConnection plugin.
 *
 * @DrupalCommand (
 *   extension="api_connection",
 *   extensionType="module"
 * )
 */
class RestApiConnectionCommand extends ContainerAwareCommand {

  use ModuleTrait;
  use CommandTrait;

  /**
   * The Console generator service.
   *
   * @var \Drupal\Console\Core\Generator\Generator
   */
  protected $generator;

  /**
   * The Console extension manager.
   *
   * @var \Drupal\Console\Extension\Manager
   */
  protected $extensionManager;

  /**
   * The Console validator util.
   *
   * @var \Drupal\Console\Utils\Validator
   */
  protected $validator;

  /**
   * The Console string converter util.
   *
   * @var \Drupal\Console\Core\Utils\StringConverter
   */
  protected $stringConverter;

  /**
   * The Console chain queue util.
   *
   * @var \Drupal\Console\Core\Utils\ChainQueue
   */
  protected $chainQueue;

  /**
   * RestApiConnectionCommand constructor.
   *
   * @param \Drupal\Console\Core\Generator\Generator $generator
   *   The Console generator service.
   * @param \Drupal\Console\Extension\Manager $extensionManager
   *   The Console extension manager.
   * @param \Drupal\Console\Utils\Validator $validator
   *   The Console validator util.
   * @param \Drupal\Console\Core\Utils\StringConverter $stringConverter
   *   The Console string converter util.
   * @param \Drupal\Console\Core\Utils\ChainQueue $chainQueue
   *   The Console chain queue util.
   */
  public function __construct(Generator $generator, Manager $extensionManager, Validator $validator, StringConverter $stringConverter, ChainQueue $chainQueue) {
    $this->generator = $generator;
    $this->extensionManager = $extensionManager;
    $this->validator = $validator;
    $this->stringConverter = $stringConverter;
    $this->chainQueue = $chainQueue;
    parent::__construct();
  }

  /**
   * {@inheritdoc}
   */
  protected function configure() {
    $this
      ->setName('generate:plugin:api_connection:rest')
      ->setAliases(['gprac'])
      ->setDescription($this->trans('commands.api_connection.generate.rest_api_connection.description'))
      ->addOption(
        'module',
        NULL,
        InputOption::VALUE_REQUIRED,
        $this->trans('commands.api_connection.generate.rest_api_connection.options.module')
      )
      ->addOption(
        'name',
        NULL,
        InputOption::VALUE_OPTIONAL,
        $this->trans('commands.api_connection.generate.rest_api_connection.options.options.name')
      )
      ->addOption(
        'machine-name',
        NULL,
        InputOption::VALUE_REQUIRED,
        $this->trans('commands.api_connection.generate.rest_api_connection.options.machine-name')
      )
      ->addOption(
        'dev-url',
        NULL,
        InputOption::VALUE_OPTIONAL,
        $this->trans('commands.api_connection.generate.rest_api_connection.options.urls.dev')
      )
      ->addOption(
        'test-url',
        NULL,
        InputOption::VALUE_OPTIONAL,
        $this->trans('commands.api_connection.generate.rest_api_connection.options.urls.test')
      )
      ->addOption(
        'live-url',
        NULL,
        InputOption::VALUE_OPTIONAL,
        $this->trans('commands.api_connection.generate.rest_api_connection.options.urls.live')
      );
  }

  /**
   * {@inheritdoc}
   */
  protected function interact(InputInterface $input, OutputInterface $output) {
    $validator = $this->validator;
    $this->getModuleOption();

    $name = $input->getOption('name');
    if (!$name) {
      $name = $this->getIo()->askEmpty(
        $this->trans('commands.api_connection.generate.rest_api_connection.questions.name'),
        NULL
      );
      $input->setOption('name', $name);
    }

    $machine_name = NULL;
    try {
      $machine_name = $input->getOption('machine-name') ?
        $validator->validateModuleName(
          $input->getOption('machine-name')
        ) : NULL;
    }
    catch (\Exception $error) {
      $this->getIo()->error($error->getMessage());
    }

    if (!$machine_name) {
      $machine_name = $this->getIo()->ask(
        $this->trans('commands.api_connection.generate.rest_api_connection.questions.machine-name'),
        $this->stringConverter->camelCaseToMachineName($name),
        function ($machine_name_internal) use ($validator) {
          return $validator->validateMachineName($machine_name_internal);
        }
      );
      $input->setOption('machine-name', $machine_name);
    }

    $dev_url = $input->getOption('dev-url');
    if (!$dev_url) {
      $dev_url = $this->getIo()->askEmpty(
        $this->trans('commands.api_connection.generate.rest_api_connection.questions.urls.dev'),
        NULL
      );
      $input->setOption('dev-url', $dev_url);
    }

    $test_url = $input->getOption('test-url');
    if (!$test_url) {
      $test_url = $this->getIo()->askEmpty(
        $this->trans('commands.api_connection.generate.rest_api_connection.questions.urls.test'),
        NULL
      );
      $input->setOption('test-url', $test_url);
    }

    $live_url = $input->getOption('live-url');
    if (!$live_url) {
      $live_url = $this->getIo()->askEmpty(
        $this->trans('commands.api_connection.generate.rest_api_connection.questions.urls.live'),
        NULL
      );
      $input->setOption('live-url', $live_url);
    }
  }

  /**
   * {@inheritdoc}
   */
  protected function execute(InputInterface $input, OutputInterface $output) {
    $machine_name = $this->validator->validateMachineName($input->getOption('machine-name'));
    $module = $this->validateModule($input->getOption('module'));
    $module_path = $this->extensionManager->getModule($module)->getPath();
    $name = $input->getOption('name');
    $dev_url = $input->getOption('dev-url');
    $test_url = $input->getOption('test-url');
    $live_url = $input->getOption('live-url');

    $this->generator->generate([
      'machine_name' => $machine_name,
      'module_name' => $module,
      'module_path' => $module_path,
      'name' => $name,
      'dev-url' => $dev_url,
      'test-url' => $test_url,
      'live-url' => $live_url,
    ]);

    $this->chainQueue->addCommand('cache:rebuild', ['cache' => 'all']);
    $this->getIo()->info($this->trans('commands.api_connection.generate.rest_api_connection.messages.success'));
    return 0;
  }

}
