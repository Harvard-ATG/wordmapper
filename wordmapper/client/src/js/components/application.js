var $ = require('jquery');
var events = require('../events.js');
var services = require('../services.js');
var models = require('../models.js');
var Settings = require('../settings.js');
var PanelComponent = require('./panel.js');
var OverlayComponent = require('./overlay.js');
var TextComponent = require('./text.js');

var Application = function() {
  this.init();
};
Application.prototype.init = function() {
  this.el = $('<div>');
  
  // models
  this.models = {};
  this.models.user = new models.User();
  this.models.sources = new models.Sources();
  this.models.alignments = new models.Alignments();
  this.models.siteContext = new models.SiteContext({
    id: window.location.hostname,
    url: window.location.toString()
  });
  
  // settings
  this.settings = new Settings();
  this.settings.load(this.models.siteContext);

  // services
  this.services = {};
  this.services.importExport = new services.ImportExportService({
    siteContext: this.models.siteContext,
    alignments: this.models.alignments,
    sources: this.models.sources
  });
  this.services.persistence = new services.Persistence({
    models: this.models,
    settings: this.settings
  });

  // components
  this.components = {};
  this.components.boxes = new TextComponent({
    alignments: this.models.alignments,
    sources: this.models.sources,
    selector: this.settings.getSourceSelector()
  });
  this.components.panel = new PanelComponent({
    user: this.models.user,
    settings: this.settings
  });
  this.components.overlay = new OverlayComponent({
    alignments: this.models.alignments,
    importExport: this.services.importExport,
    sources: this.models.sources
  });

  this.onError = this.onError.bind(this);
  
  this.addListeners();
};
Application.prototype.addListeners = function() {
  events.hub.on(events.EVT.ERROR, this.onError);
};
Application.prototype.render = function() {
  this.el.append(this.components.panel.render().el);
  this.el.append(this.components.overlay.render().el);
  return this;
};
Application.prototype.renderTo = function(selector) {
  $(function() {
    $(selector).append(this.render().el);
    $(selector).css({'marginTop': this.components.panel.getHeight()+"px"});
  }.bind(this));
  return this;
};
Application.prototype.loadData = function() {
  this.models.user.restoreLogin();
  if (!this.models.user.isAuthenticated()) {
    this.services.persistence.load();
  }
  return this;
};
Application.prototype.onError = function(message) {
  window.alert("Word Mapper Error: " + message);
};

module.exports = Application;
