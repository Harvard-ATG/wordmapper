var Page = function(options) {
  this.hostname = options.hostname || '';
  this.url = options.url || '';
};
Page.prototype.getHostname = function() {
    return this.hostname;
};
Page.prototype.getUrl = function() {
    return this.url;
};
Page.prototype.toString = function() {
  return this.url;
};
Page.prototype.toJSON = function() {
  return {
    "type": "page",
    "data": {
      "hostname": this.hostname,
      "url": this.url
    }
  };
};
Page.prototype.serialize = function() {
  return JSON.stringify(this.toJSON(), null, '\t');
};

module.exports = Page;
