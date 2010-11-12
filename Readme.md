# Configurator

Configurator is a node.js module to read JSON configuration files and construct settings for the current environment. Each environment inherits settings from common and can overwrite or extend those with settings specific to the environment.

Configurator provides 1 function: settings(env, settings, fn). The 1st argument is the name of the environment to construct the settings for, e.g. "development" or "test". The 2nd argument is either a file name, a file handle or an object. Unless settings is an object, the function will first read the configuration settings from file. The 3rd and last argument is the callback function to invoke after constructing the settings for the requested environment.

# Example

    var configurator = require('configurator')
      , configurations =
        { "common":
          { "session":
            { "secret": "53ea5d82baa6c730e1da78571a908ae417f96d32"
            , "fingerprint":
              { "args": "req"
              , "body": "return req.connection.remoteAddress + req.headers['user-agent'] || '';"
              }
            }
          , "api":
            { "host": "localhost"
            , "http_port": "8001"
            , "https_port": "8444"
            , "auth":
              { "user": "foo"
              , "password": "bar"
              }
            }
          }
        , "development":
          { "api":
            { "http_port": "9001"
            , "auth":
              { "password": "hackme"
              }
            }
          }
        , "production":
          { "api":
            { "http_port": "80"
            , "https_port": "443"
            , "auth":
              { "user": "f1d2d2f924e986ac86fdf7b36c94bcdf32beec15"
              , "password": "e242ed3bffccdf271b7fbaf34ed72d089537b42f"
              }
            }
          }
        };

    configurator.settings('development', configurations, function(err, configuration) {
      // configuration holds the configuration specific to the development environment.
      console.log(configuration);
    });

produces:

    { session:
       { secret: '53ea5d82baa6c730e1da78571a908ae417f96d32'
       , fingerprint:
          { args: 'req'
          , body: 'return req.connection.remoteAddress + req.headers[\'user-agent\'] || \'\';'
          }
       }
    , api:
       { host: 'localhost'
       , http_port: '9001'
       , https_port: '8444'
       , auth: { user: 'foo', password: 'hackme' }
       }
    }

In this example session.fingerprint is a function serialized to JSON and can be reconstructed like so:

    new Function(configuration.session.fingerprint.args, configuration.session.fingerprint.body)

