var configurator = require('configurator')
  , fs = require('fs')
  , configurations = fs.openSync(__dirname + '/configuration.json', 'r');

configurator.settings('development', configurations, function(err, configuration) {
  // configuration holds the configuration specific to the development environment.
  console.log(configuration);
})

