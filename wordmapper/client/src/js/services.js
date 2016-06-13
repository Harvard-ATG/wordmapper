var models = require('./models.js');

//---------------------------------------------------------------------
var StorageService = function(options) {
  options = options || {};
  this.siteContext = options.siteContext || '';
  this.sources = options.sources || [];
};
StorageService.prototype.load = function() {
  var deferred = $.Deferred();
  this._load(deferred);
  return deferred;
};
StorageService.prototype.save = function(obj) {
  var deferred = $.Deferred();
  var serialized = this._serialize(obj);
  this._save(deferred, serialized);
  return deferred;
};
StorageService.prototype.getDataKey = function() {
  var sourceHashes = this.sources.map(function(source) {
    return source.hash;
  });
  sourceHashes.sort(function(a, b) {
    return (a == b ? 0 : (a < b ? -1 : 1));
  });
  return this.siteContext.id + "::" + sourceHashes.join(",");
};
StorageService.prototype.getSourceMap = function() {
  var dict = {};
  this.sources.forEach(function(source) {
    dict[source.hash] = source;
  });
  return dict;
};
StorageService.prototype._load = function() {
  throw "Subclass responsibility";
};
StorageService.prototype._save = function() {
  throw "Subclass responsibility";
};
StorageService.prototype._serialize = function() {
  throw "Subclass responsibility";
};

//---------------------------------------------------------------------
var LocalStorageService = function() {
  if (window.Storage === undefined) {
    throw "LocalStorage not supported in this browser.";
  }
  StorageService.apply(this, arguments);
};
LocalStorageService.prototype = new StorageService();
LocalStorageService.prototype._serialize = function(obj) {
  return obj.serialize();
};
LocalStorageService.prototype._load = function(deferred) {
  var jsonData = localStorage.getItem(this.getDataKey());
  var sourceMap = this.getSourceMap();
  var result = null;
  var alignments = [];
  
  if (jsonData === null) {
    deferred.resolve([]);
    return;
  }

  result = JSON.parse(jsonData);
  alignments = result.data.map(function(alignment) {
    var words = alignment.data.map(function(word) {
      return models.Word.create({
        index: word.data.index,
        value: word.data.value,
        source: sourceMap[word.data.source]
      });
    });
    return models.Alignments.createAlignment(words);
  });

  deferred.resolve(alignments);
  return;
};
LocalStorageService.prototype._save = function(deferred, serialized) {
  localStorage.setItem(this.getDataKey(), serialized);
  deferred.resolve();
};

module.exports = {
  LocalStorageService: LocalStorageService
};