var YUI = require('yui3').YUI
  , fs = require('fs');

/**
 * Construct the configuration applicable for environment env from settings
 *
 * @param env {string} The name of the environment to return the configuration settings for.
 * @param settings {object|fd|string}
 *   - An object with at least the common configuration in the 'common' attribute.
 *     Each supported environment can overwrite settings from the common configuration in an attribute of the name of
 *     the environment.
 *   - Or a file descriptor to a file with the configuration serialized to JSON.
 *   - Or the path to a file with the configuration serialized to JSON.
 * @param fn {Function(?Error, ?Object)} Callback function. Receives an {@link Error} and null if an error occurred constructing
 *   the configuration. If no error occurred then the 1st argument will be null and the 2nd arguments is the configuration
 *   object applicable for the environment.
 */
module.exports.settings = function(env, settings, fn) {
  if (typeof settings === 'string') {
    // Read the file by filename
    fs.readFile(settings, 'utf8', function(err, json) {
      if (err) {
        fn(err, null);
      } else {
        try {
          mixSettings(env, JSON.parse(json), fn);
        } catch(err) {
          fn(err, null);
        }
      }
    })
  } else if (typeof settings === 'number') {
    // Read the file by file descriptor
    fs.fstat(settings, function(err, stats){
      if (err) {
        fn(err, null);
      } else {
        fs.read(settings, stats.size, 0, 'utf-8', function(err, json, bytesRead){
          if (err) {
            fn(err, null);
          } else {
            try {
              mixSettings(env, JSON.parse(json), fn);
            } catch(err) {
              fn(err, null);
            }
          }
        })
      }
    })
  } else {
    // Received the configuration object.
    mixSettings(env, settings, fn);
  }
};

/**
 * Mix the common settings with the overwrites for env.
 *
 * @param env {string} The name of the environment to return the configuration settings for.
 * @param settings {object} An object with at least the common configuration in the 'common' attribute.
 * @param fn {Function(?Error, ?Object)} Callback function. Receives an {@link Error} and null if an error occurred constructing
 *   the configuration. If no error occurred then the 1st argument will be null and the 2nd arguments is the configuration
 *   object applicable for the environment.
 */
function mixSettings(env, settings, fn) {
  YUI({
    debug: false
  }).use('oop', function(Y) {
    try {
      fn(null, Y.mix(Y.clone(settings.common), settings[env], true, null, 0, true));
    } catch(err) {
      fn(err, null);
    }
  })
}
