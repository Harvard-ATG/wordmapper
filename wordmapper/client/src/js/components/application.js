var services = require('../services.js');
var models = require('../models.js');
var Panel = require('./panel.js');
var Overlay = require('./overlay.js');
var TextBoxes = require('./text_boxes.js');

var Application = function() {
  this.init();
};
Application.prototype.init = function() {
  this.el = $('<div>').appendTo('body');
  this.panel = new Panel();
  this.alignments = new models.Alignments();
  this.siteContext = new models.SiteContext({
    id: window.location.hostname,
    url: window.location.toString()
  });
  this.settings = services.SettingsService.get(this.siteContext);
  this.boxes = new TextBoxes({
    alignments: this.alignments,
    selector: this.settings.sourceSelector
  });
  this.overlay = new Overlay({
    siteContext: this.siteContext,
    alignments: this.alignments
  });
  this.storage = new services.LocalStorageService({
    siteContext: this.siteContext,
    sources: this.boxes.sources
  });
  this.loadData();
  this.addListeners();
};
Application.prototype.addListeners = function() {
  this.alignments.on('change', this.saveData.bind(this));
};
Application.prototype.render = function() {
  this.el.append(this.panel.render().el);
  this.el.append(this.overlay.render().el);
  return this;
};
Application.prototype.saveData = function() {
  console.log("saving to storage");
  var deferred = this.storage.save(this.alignments);
  deferred.done(function() {
    console.log("save completed");
  });
};
Application.prototype.loadData = function() {
  console.log("loading from storage");
  var deferred = this.storage.load();
  deferred.done(function(batch) {
    this.alignments.load(batch);
    console.log("load completed", batch);
  }.bind(this));
};

module.exports = Application;