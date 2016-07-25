var events = require('../events.js');
var Source = require('./source.js');

var Sources = function(options) {
  options = options || {};
  this.pageUrl = options.pageUrl;
  this.sources = options.sources || [];
};
Sources.prototype.triggerChange = function() {
  this.trigger("change");
};
Sources.prototype.addSources = function(sources) {
  this.sources = this.sources.concat(sources || []);
  this.triggerChange();
  return this;
};
Sources.prototype.getSourceIndexMap = function() {
  return this.sources.reduce(function(dict, source) {
    dict[source.index] = source;
    return dict;
  }, {});
};
Sources.prototype.getSourceHashMap = function() {
  return this.sources.reduce(function(dict, source) {
    dict[source.hash] = source;
    return dict;
  }, {});
};
Sources.prototype.getSourceByHash = function(hash) {
  var sourceMap = this.getSourceMap();
  return sourceMap[hash];
};
Sources.prototype.getHashes = function() {
  var sourceHashes = this.sources.map(function(source) {
    return source.hash;
  });
  sourceHashes.sort(function(a, b) {
    return (a == b ? 0 : (a < b ? -1 : 1));
  });
  return sourceHashes;
};
Sources.prototype.getHashKey = function() {
  return this.getHashes().join(",");
};
Sources.prototype.toString = function() {
  return this.getHashKey();
};
Sources.prototype.toJSON = function() {
  return {
    "type": "sources",
    "url": this.pageUrl,
    "data": this.sources.map(function(source) {
      return source.toJSON();
    })
  };
};
Sources.prototype.serialize = function() {
  return JSON.stringify(this.toJSON(), null, '\t');
};

// convenience methods to operate on the underlying objects by callers...
['map', 'forEach', 'reduce', 'filter'].forEach(function(method) {
  Sources.prototype[method] = function() {
    return Array.prototype[method].apply(this.sources, arguments);
  };
});

events.Events.mixin(Sources.prototype);

module.exports = Sources;
