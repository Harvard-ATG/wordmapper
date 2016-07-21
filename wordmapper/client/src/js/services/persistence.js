var _ = require('lodash');
var StorageLocal = require('./storage_local.js');
var StorageRemote = require('./storage_remote.js');

var Persistence = function(options) {
  options = options || {};
  options = _.assign({models: {}}, options);

  this.settings = options.settings;
  this.models = options.models;
  
  this.stores = {};
  this.stores.local = new StorageLocal(this, { enabled: true });
  this.stores.remote = new StorageRemote(this, { enabled: false });
  this.primaryStore = this.stores.local;
  
  // true when then source models have been initialized 
  this.sourcesReady = false; 
  
  this.onAlignmentsChange = this.onAlignmentsChange.bind(this);
  this.onSourcesChange = this.onSourcesChange.bind(this);
  this.onUserChange = this.onUserChange.bind(this);
  this.loadAlignments = this.loadAlignments.bind(this);

  this.init();
};
Persistence.prototype.init = function() {
  this.addListeners();
};
Persistence.prototype.addListeners = function() {
  this.models.alignments.on('change', this.onAlignmentsChange);
  this.models.sources.on('change', this.onSourcesChange);
  this.models.user.on('change', this.onUserChange);
};
Persistence.prototype.onAlignmentsChange = function() {
  this.saveAlignments();
};
Persistence.prototype.onSourcesChange = function() {
  this.sourcesReady = true;
};
Persistence.prototype.onUserChange = function() {
  console.log("user change", this.models.user);
  if (this.models.user.isAuthenticated()) {
    this.stores.remote.enable();
    this.stores.local.disable();
    this.primaryStore = this.stores.remote;
  } else {
    this.stores.remote.disable();
    this.stores.local.enable();
    this.primaryStore = this.stores.local;
  }

  this.load();
};
Persistence.prototype.load = function() {
  return this.loadSources().then(this.loadAlignments, function() {
    return this.saveSources().then(this.loadAlignments);
  }.bind(this));
};
Persistence.prototype.loadAlignments = function() {
  var _this = this, store = this.primaryStore;
  return new Promise(function(resolve, reject) {
    store.loadAlignments().then(function(data) {
      _this.models.alignments.load(data);
      resolve();
    }, reject);
  });
};
Persistence.prototype.loadSources = function() {
  var _this = this, store = this.primaryStore;
  return new Promise(function(resolve, reject) {
    store.loadSources().then(resolve, reject);
  });
};
Persistence.prototype.saveAlignments = function() {
  var _this = this;
  return new Promise(function(resolve, reject) {
    var promises = _this.mapEnabled(function(store) {
      return store.saveAlignments();
    });
    Promise.all(promises).then(resolve).catch(reject);
  });
};
Persistence.prototype.saveSources = function() {
  var _this = this;
  return new Promise(function(resolve, reject) {
    var promises = _this.mapEnabled(function(store) {
      return store.saveSources();
    });
    Promise.all(promises).then(resolve).catch(reject);
  });
};
Persistence.prototype.mapEnabled = function(callback) {
  var results = [];
  for(var k in this.stores) {
    if (this.stores.hasOwnProperty(k)) {
      if (this.stores[k].enabled()) {
        results.push(callback(this.stores[k], k));
      }
    }
  }
  return results;
};

module.exports = Persistence;
