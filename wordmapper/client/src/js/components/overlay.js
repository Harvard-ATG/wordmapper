var events = require('../events.js');
var templates = require('../templates.js');

var Overlay = function(options) {
  this.alignments = options.alignments;
  this.siteContext = options.siteContext;
  this.lastRenderer = null;
  this.hiddenCls = 'wordmapper-overlay-hidden';
  this.popout = this.popout.bind(this);
  this.init();
};
Overlay.prototype.init = function() {
  this.el = $("<div>").append('<div class="'+this.hiddenCls+'"></div>');
  this.addListeners();
};
Overlay.prototype.addListeners = function() {
  events.hub.on(events.EVT.BUILD_INDEX, this.makeRenderer("index"));
  events.hub.on(events.EVT.EXPORT, this.makeRenderer("export"));
  this.el.on('click', '.openWindow', null, this.popout);
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
Overlay.prototype.popout = function() {
  var opts = [
    "toolbar=no",
    "location=no",
    "directories=no",
    "status=no",
    "menubar=no",
    "scrollbars=yes",
    "resizable=yes",
    "width=400",
    "height=600", 
    'top="'+(window.screen.height-400)+'"',
    'left="'+(window.screen.width-840)+'"'
  ];
  var win = window.open("", this.lastRenderer, opts.join(","));
  var cloned = $(this.el)[0].cloneNode(true);
  
  // remove the popout button
  $(cloned).find('.openWindow').remove();
  
  // set the content of the new window
  win.document.body.innerHTML = $(cloned).html();
  
  // copy our stylesheet(s) to the new window
  for (var children = window.document.head.children, i = 0; i < children.length; i++) {
    if (children[i].tagName === "STYLE" && children[i].textContent.indexOf(".wordmapper") >= 0) {
      win.document.head.appendChild(children[i].cloneNode(true)); 
    }
  }
};

module.exports = Overlay;