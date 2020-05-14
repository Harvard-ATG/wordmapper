var logging = require('logging');
var parser = require('./parser.js');

var AlignmentsParser = parser.AlignmentsParser;

var StorageLocal = function(parent, options) {
  options = options || {};
  this.parent = parent;
  this._enabled = options.enabled || false;
  if (window.Storage === undefined) {
    logging.error("LocalStorage not supported in this browser.");
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
  logging.debug("StorageLocal loadAlignments");
  var jsonData = localStorage.getItem(this._getAlignmentsKey());
  if (jsonData === null) {
    return Promise.resolve([]);
  }
  try {
    return Promise.resolve(this._parseAlignments(jsonData));
  } catch (e) {
    return Promise.reject(e);
  }
};
StorageLocal.prototype.resetAlignments = function() {
  logging.debug("StorageLocal resetAlignments");
  localStorage.removeItem(this._getAlignmentsKey());
  return Promise.resolve();
};
StorageLocal.prototype.saveAlignments = function() {
  logging.debug("StorageLocal saveAlignments");
  var serialized = this.parent.models.alignments.serialize();
  localStorage.setItem(this._getAlignmentsKey(), serialized);
  return Promise.resolve();
};
StorageLocal.prototype.loadSources = function() {
  logging.debug("StorageLocal loadSources");
  return Promise.resolve();
};
StorageLocal.prototype.saveSources = function() {
  logging.debug("StorageLocal saveSources");
  return Promise.resolve();
};
StorageLocal.prototype._getAlignmentsKey = function() {
  var hashKey = this.parent.models.sources.getHashKey();
  var hostname = this.parent.models.page.getHostname();
  return hostname + "::" + hashKey;
};
StorageLocal.prototype._parseAlignments = function(data) {
  var parser = new AlignmentsParser(data, this.parent.models.sources);
  parser.parse();
  return parser.output;
};

module.exports = StorageLocal;