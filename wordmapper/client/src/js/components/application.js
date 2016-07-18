var $ = require('jquery');
var services = require('../services.js');
var models = require('../models.js');
var Panel = require('./panel.js');
var Overlay = require('./overlay.js');
var TextBoxes = require('./text_boxes.js');

var Application = function() {
  this.init();
};
Application.prototype.init = function() {
  this.el = $('<div>');
  this.panel = new Panel();
	this.user = new models.User();
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
  this.importExport = new services.ImportExportService({
    siteContext: this.siteContext,
    alignments: this.alignments,
    sources: this.boxes.sources
  });
  this.overlay = new Overlay({
    alignments: this.alignments,
    importExport: this.importExport,
    sources: this.boxes.sources
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
Application.prototype.renderTo = function(selector) {
  $(function() {
    $(selector).append(this.render().el);
    $(selector).css('transition', 'margin 1s');
    $(selector).css('marginTop', this.panel.getHeight()+"px");
  }.bind(this));
  return this;
};
Application.prototype.saveData = function() {
  console.log("saving to storage");
  var promise = this.storage.save(this.alignments);
  promise.done(function() {
    console.log("save completed");
  });
};
Application.prototype.loadData = function() {
  console.log("loading from storage");
  var promise = this.storage.load();
  promise.done(function(batch) {
    this.alignments.load(batch);
    console.log("load completed", batch);
  }.bind(this));
};

module.exports = Application;
