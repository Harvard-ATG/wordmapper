var config = require('config');

var debug = function() {
  if (config.DEBUG) {
    console.debug.apply(console, arguments);
  }
};
var log = function() {
  console.log.apply(console, arguments);
};
var error = function() {
  console.error.apply(console, arguments);
};

module.exports.debug = debug;
module.exports.log = log;
module.exports.error = error;