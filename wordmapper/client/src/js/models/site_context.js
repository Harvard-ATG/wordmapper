var SiteContext = function(options) {
  this.id = options.id || '';
  this.url = options.url || '';
};
SiteContext.prototype.toString = function() {
  return this.url;
};
SiteContext.prototype.toJSON = function() {
  return {
    "type": "siteContext",
    "data": {
      "id": this.id,
      "url": this.url
    }
  };
};
SiteContext.prototype.serialize = function() {
  return JSON.stringify(this.toJSON(), null, '\t');
};

module.exports = SiteContext;