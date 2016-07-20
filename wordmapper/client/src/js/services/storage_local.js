var $ = require('jquery');
var parser = require('./parser.js');

var AlignmentsParser = parser.AlignmentsParser;

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
  var hashKey = this.parent.models.sources.getHashKey();
  var siteId = this.parent.models.siteContext.id;
  return siteId + "::" + hashKey;
};
StorageLocal.prototype._parseAlignments = function(data) {
  var parser = new AlignmentsParser(data, this.parent.models.sources);
  parser.parse();
  return parser.output;
};

module.exports = StorageLocal;