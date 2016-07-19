var $ = require('jquery');
var models = require('../models.js');

var StorageLocal = function(parent, options) {
  options = options || {};
  this.parent = parent;
  this._enabled = options.enabled || false;
  if (window.Storage === undefined) {
    console.error("LocalStorage not supported in this browser.");
    this._enabled = false;
  }
};
StorageLocal.prototype.enabled = function() {
  return this._enabled;
};
StorageLocal.prototype.enable = function() {
  this._enabled = true;
};
StorageLocal.prototype.disable = function() {
  this._enabled = false;
};
StorageLocal.prototype.loadAlignments = function() {
  console.log("StorageLocal loadAlignments");
  var deferred = $.Deferred();
  var jsonData = localStorage.getItem(this._getAlignmentsKey());
  if (jsonData === null) {
    deferred.resolve([]);
  } else {
    deferred.resolve(this._parseAlignments(jsonData));
  }
  return deferred.promise();
};
StorageLocal.prototype.saveAlignments = function() {
  console.log("StorageLocal saveAlignments");
  var deferred = $.Deferred();
  var serialized = this.parent.models.alignments.serialize();
  localStorage.setItem(this._getAlignmentsKey(), serialized);
  deferred.resolve();
  return deferred.promise();
};
StorageLocal.prototype.loadSources = function() {
  console.log("StorageLocal loadSources");
  return $.Deferred().resolve().promise();
};
StorageLocal.prototype.saveSources = function() {
  console.log("StorageLocal saveSources");
  return $.Deferred().resolve().promise();
};
StorageLocal.prototype._getAlignmentsKey = function() {
  var hashes = this.parent.models.sources.getHashes();
  var siteId = this.parent.models.siteContext.id;
  return siteId + "::" + hashes.join(",");
};
StorageLocal.prototype._parseAlignments = function(jsonData) {
  var result = JSON.parse(jsonData);
  var sourceMap = this.parent.models.sources.getSourceHashMap();
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

module.exports = StorageLocal;