var _ = require('lodash');
var config = require('config');
var logging = require('logging');

var Settings = function(options) {
  options = options || {};
  this.assertConfig(config);
  this.current = _.assign({}, config, options);
};
Settings.prototype.assertConfig = function(givenConfig) {
  var required = ['apiBaseUrl', 'registerUrl'];
  required.forEach(function(key) {
    if (!givenConfig.hasOwnProperty(key) || !givenConfig[key]) {
      throw 'Invalid "config" for environment. Missing required key: ' + key;
    }
  });
};
Settings.prototype.hostConfig = {
  '*': {
    'sourceSelector': 'body'
  },
  'www.graeco-arabic-studies.org': {
    'sourceSelector': '.textboxcontent'
  },
  'sites.google.com': {
    'sourceSelector': '.textboxcontent'
  },
  'canvas.harvard.edu': {
    'sourceSelector': '.textboxcontent'
  }
};
Settings.prototype.load = function(page) {
  var data = false;
  var base = '*';
  var msg = '';
  var hostname = page.getHostname();
  
  if (hostname in this.hostConfig) {
    data = this.hostConfig[hostname];
    msg = "Settings loaded for '"+hostname+"'.";
  } else {
    data = this.hostConfig[base];
    msg = "Settings _NOT_ found for '"+hostname+"'. Loaded base settings '"+base+"'. ";
  }
  _.assign(this.current, data);
  logging.log(msg, this.current);
  return this;
};
Settings.prototype.getSourceSelector = function() {
  return this.current.sourceSelector;
};
Settings.prototype.getAPIBaseUrl = function() {
  return this.current.apiBaseUrl;
};
Settings.prototype.getRegisterUrl = function() {
  return this.current.registerUrl;
};
module.exports = Settings;