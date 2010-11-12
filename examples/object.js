var configurator = require('configurator')
  , fs = require('fs')
  , configurations = JSON.parse(fs.readFileSync(__dirname + '/configuration.json'));

configurator.settings('development', configurations, function(err, configuration) {
  // configuration holds the configuration specific to the development environment.
  console.log(configuration);
});
