var _ = require('lodash');
var config = require('config');
var logging = require('logging');

var Settings = function(options) {
  options = options || {};
  this.assertConfig(config);
  this.current = _.assign({}, config, options);
};
Settings.prototype.assertConfig = function(givenConfig) {
  var required = ['apiBaseUrl', 'baseUrl'];
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
  /*
   * NOTE: Google Sites seems to scrub HTML so it is not possible
   * to manually add a custom class name to identify source texts.
   * The selector below assumes that the source texts are placed in
   * a single table on the page, one text per cell.
   */
  'sites.google.com': {
    'sourceSelector': '.sites-layout-tile table td' 
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
  return this.current.baseUrl + '/user/register';
};
Settings.prototype.getHomeUrl = function() {
  return this.current.baseUrl + '/';
};
module.exports = Settings;