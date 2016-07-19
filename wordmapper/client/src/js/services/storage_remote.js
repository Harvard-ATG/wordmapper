var models = require('../models.js');

var StorageRemote = function(parent, options) {
  options = options || {};
  this.parent = parent;
  this._enabled = options.enabled || false;
};
StorageRemote.prototype.enabled = function() {
  return this._enabled;
};
StorageRemote.prototype.enable = function() {
  this._enabled = true;
};
StorageRemote.prototype.disable = function() {
  this._enabled = false;
};
StorageRemote.prototype.loadAlignments = function() {
  console.log("StorageRemote loadAlignments");
};
StorageRemote.prototype.saveAlignments = function() {
  console.log("StorageRemote saveAlignments");
};
StorageRemote.prototype.loadSources = function() {
  console.log("StorageRemote loadSources");
};
StorageRemote.prototype.saveSources = function() {
  console.log("StorageRemote saveSources");
};

module.exports = StorageRemote;