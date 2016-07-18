var _ = require('lodash');

var Settings = function() {
  this.current = {
    'apiBaseUrl': 'http://localhost:8000/api',
    'registerUrl': 'http://localhost:8000/user/register'
  };  
};
Settings.prototype.defaults = {
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
Settings.prototype.load = function(siteContext) {
  var data = false;
  console.log("Loading source selector for site ID: ", siteContext.id);
  if (siteContext.id in this.defaults) {
    data = this.defaults[siteContext.id];
    console.log("Site ID exists. Settings: ", data);
  } else {
    data = this.defaults['*'];
    console.log("No such site ID exists. Using base settings: ", data);
  }
  _.assign(this.current, data);
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