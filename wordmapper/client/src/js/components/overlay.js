var events = require('../events.js');
var templates = require('../templates.js');

var Overlay = function(options) {
  this.alignments = options.alignments;
  this.siteContext = options.siteContext;
  this.lastRenderer = null;
  this.hiddenCls = 'wordmapper-overlay-hidden';
  this.init();
};
Overlay.prototype.init = function() {
  this.el = $("<div>").append('<div class="'+this.hiddenCls+'"></div>');
  this.addListeners();
};
Overlay.prototype.addListeners = function() {
  events.hub.on(events.EVT.BUILD_INDEX, this.makeRenderer("index"));
  events.hub.on(events.EVT.EXPORT, this.makeRenderer("export"));
};
Overlay.prototype.visible = function() {
  return this.el.andSelf().find('.' + this.hiddenCls).length === 0;
};
Overlay.prototype.render = function() {
  return this;
};
Overlay.prototype.makeRenderer = function(name) {
  return function() {
    var template = templates[name];
    this.el.html(template({
      cls: this.getCls(name),
      alignments: this.alignments,
      siteContext: this.siteContext
    }));
    this.lastRenderer = name;
    return this;
  }.bind(this);
};
Overlay.prototype.getCls = function(renderer) {
  var cls = '';
  if (this.visible()) {
    if (renderer === this.lastRenderer) {
      cls = this.hiddenCls;
    }
  }
  return cls;
};

module.exports = Overlay;