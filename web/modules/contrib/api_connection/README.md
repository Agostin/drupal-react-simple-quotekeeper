# API Connection module

This is a helper module to let your Drupal website connect to external APIs.

This module uses a Plugin architecture, that allows you to define a plugin in
your custom Drupal module, for each REST API / web service you want to integrate
with.

# Features

- Provides a RestApiConnection plugin type to use in your modules for connecting
  to an external REST API.
- Ability to log REST API requests and responses in Drupal logger / watchdog.
- Ability to differentiate between dev / test / live environments.
- Drupal Console command to quickly create a RestApiConnection plugin.

# Defining a new REST API connection

1. Declare a new @RestApiConnection plugin with an annotation:

```
/**
 * RestApiConnection plugin to connect to ExampleApi.
 *
 * @RestApiConnection(
 *   id = "example_api",
 *   label = @Translation("Example API connection"),
 *   urls = {
 *     "dev" = "https://dev.example.api",
 *     "test" = https://test.example.api,
 *     "live" = "https://live.example.api"
 *   },
 *   activated = TRUE
 * )
 */
```

2. Optionally use Plugin configuration for specific settings, e.g. API keys, ...
To do so, your plugin should override the following methods:
defaultConfiguration(), buildConfigurationForm(), submitConfigurationForm().
The plugin-specific config can be retrieved via ```$this->configuration``` in
your custom plugin code.

3. Write custom logic in your Plugin class to interact with the API.
Example code:
```
/**
 * Get user data for a given user ID.
 *
 * @param int $id
 *   The user ID.
 *
 * @return array
 *   The user data.
 */
public function getUser($id) {
  return $this->sendRequest("api/users/{$id}", "GET");
}
```

# Recommended setup

It is recommended to use the config_ignore or config_split module to be able to
have different module settings for each environment. Add
"api_connection.settings" to one of these modules, to define the environment,
whether to enable logging, etc... per hosting environment.

# Examples

See the api_connection_example submodule for a basic example implementation.
