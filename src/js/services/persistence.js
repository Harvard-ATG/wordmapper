var _ = require('lodash');
var logging = require('logging');
var events = require('../events.js');
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

  this.sourcesReady = false; 
  
  this.init();
};
Persistence.prototype.init = function() {
  this.bindMethods();
  this.addListeners();
};
Persistence.prototype.bindMethods = function() {
  _.bindAll(this, [
    'onAlignmentsChange',
    'onAlignmentsReset',
    'onSourcesChange',
    'onUserChange',
    'loadAlignments',
    'loadSources',
    'saveAlignments',
    'resetAlignments',
    'saveSources',
    'endLoading',
    'startLoading',
    'notifySave',
    'notifyReset'
  ]);
};
Persistence.prototype.addListeners = function() {
  this.models.alignments.on('change', this.onAlignmentsChange);
  this.models.alignments.on('reset', this.onAlignmentsReset);
  this.models.sources.on('change', this.onSourcesChange);
  this.models.user.on('change', this.onUserChange);
};
Persistence.prototype.onAlignmentsChange = function() {
  var _this = this;
  this.startLoading()
    .then(this.saveAlignments)
    .then(this.endLoading)
    .then(this.notifySave)
    .catch(function(err) {
      _this.endLoading();
      _this.handleError(err);
    });
};
Persistence.prototype.onAlignmentsReset = function() {
  var _this = this;
  this.startLoading()
    .then(this.resetAlignments)
    .then(this.endLoading)
    .then(this.notifyReset)
    .catch(function(err) {
      _this.endLoading();
      _this.handleError(err);
    });
};
Persistence.prototype.onSourcesChange = function() {
  this.sourcesReady = true;
};
Persistence.prototype.onUserChange = function() {
  logging.log("user change", this.models.user);
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
  var _this = this;
  var saveSources = function() {
    return _this.saveSources().then(_this.loadAlignments);
  };

  return _this.startLoading()
    .then(_this.loadSources)
    .then(_this.loadAlignments, saveSources)
    .then(_this.endLoading)
    .catch(function(err) {
      _this.endLoading();
      _this.handleError(err);
    });
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
  var store = this.primaryStore;
  return store.loadSources();
};
Persistence.prototype.saveAlignments = function() {
  var store = this.primaryStore;
  return store.saveAlignments();
};
Persistence.prototype.resetAlignments = function() {
  var store = this.primaryStore;
  return store.resetAlignments();
};
Persistence.prototype.saveSources = function() {
  var store = this.primaryStore;
  return store.saveSources();
};
Persistence.prototype.handleError = function(err) {
  this.notifyError(err);
  logging.error(err);
};
Persistence.prototype.startLoading = function() {
  events.hub.trigger(events.EVT.LOADING, "start", "data");
  return Promise.resolve();
};
Persistence.prototype.endLoading = function() {
  events.hub.trigger(events.EVT.LOADING, "end", "data");
  return Promise.resolve();
};
Persistence.prototype.notifySave = function() {
  this.notifyMessage("success", "Saved @ " + this.getTimestamp());
  return Promise.resolve();
};
Persistence.prototype.notifyReset = function() {
  this.notifyMessage("success", "Deleted @ " + this.getTimestamp());
  return Promise.resolve();
};
Persistence.prototype.notifyMessage = function(messageType, message) {
  events.hub.trigger(events.EVT.NOTIFICATION, messageType, message);
};
Persistence.prototype.notifyError = function(error) {
  events.hub.trigger(events.EVT.ERROR, error);
};
Persistence.prototype.getTimestamp = function() {
  var d = new Date();
  return [d.getHours(), d.getMinutes(), d.getSeconds()].join(":");
};

module.exports = Persistence;
