var $ = require('jquery');
var models = require('../models.js');

var StorageService = function(options) {
  options = options || {};
  this.siteContext = options.siteContext || '';
  this.sources = options.sources || [];
};
StorageService.prototype.load = function() {
  var deferred = $.Deferred();
  this._load(deferred);
  return deferred.promise();
};
StorageService.prototype.save = function(obj) {
  var deferred = $.Deferred();
  var serialized = this._serialize(obj);
  this._save(deferred, serialized);
  return deferred.promise();
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
StorageService.prototype._serialize = function(obj) {
  return obj.serialize();
};
StorageService.prototype._parse = function(jsonData) {
  var sourceMap = this.getSourceMap();
  var result = JSON.parse(jsonData);
  var alignments = result.data.map(function(alignment) {
    var words = alignment.data.filter(function(item) {
      return item.type == 'word';
    }).map(function(word) {
      return models.Word.create({
        index: word.data.index,
        value: word.data.value,
        source: sourceMap[word.data.source]
      });
    });
    var comment_texts = alignment.data.filter(function(item) {
      return item.type == 'comment';
    }).map(function(comment) {
      return comment.data.text;
    });
    var alignment_obj = models.Alignments.createAlignment(words);
    if (comment_texts.length > 0) {
      alignment_obj.setComment(comment_texts[0]);
    }
    return alignment_obj;
  });
  return alignments;
};

//---------------------------------------------------------------------
var LocalStorageService = function() {
  if (window.Storage === undefined) {
    throw "LocalStorage not supported in this browser.";
  }
  StorageService.apply(this, arguments);
};
LocalStorageService.prototype = new StorageService();
LocalStorageService.prototype._load = function(deferred) {
  var jsonData = localStorage.getItem(this.getDataKey());
  if (jsonData === null) {
    deferred.resolve([]);
  } else {
    deferred.resolve(this._parse(jsonData));
  }
};
LocalStorageService.prototype._save = function(deferred, serialized) {
  localStorage.setItem(this.getDataKey(), serialized);
  deferred.resolve();
};

module.exports = LocalStorageService;