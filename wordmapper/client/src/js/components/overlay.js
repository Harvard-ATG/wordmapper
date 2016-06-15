var $ = require('jquery');
var events = require('../events.js');
var templates = require('../templates.js');
var services = require('../services.js');

var Overlay = function(options) {
  this.alignments = options.alignments;
  this.siteContext = options.siteContext;
  this.lastRenderer = null;
  this.hiddenCls = 'wordmapper-overlay-hidden';
  this.popout = this.popout.bind(this);
  this.dismiss = this.dismiss.bind(this);
  this.init();
};
Overlay.prototype.init = function() {
  this.el = $("<div>").append('<div class="'+this.hiddenCls+'"></div>');
  this.addListeners();
};
Overlay.prototype.addListeners = function() {
  events.hub.on(events.EVT.BUILD_INDEX, this.makeRenderer("index"));
  events.hub.on(events.EVT.EXPORT, this.makeRenderer("export"));
  this.el.on('click', '.wordmapper-import', null, this.import);
  this.el.on('click', '.wordmapper-popout', null, this.popout);
  this.el.on('click', '.wordmapper-dismiss', null, this.dismiss);
};
Overlay.prototype.visible = function() {
  return this.el.andSelf().find('.' + this.hiddenCls).length === 0;
};
Overlay.prototype.render = function() {
  return this;
};
Overlay.prototype.makeRenderer = function(name) {
  var renderer = function() {
    var template = templates[name];
    this.el.html(template({
      cls: this.getCls(name),
      alignments: this.alignments,
      siteContext: this.siteContext
    }));
    this.lastRenderer = {fn:renderer, name:name};
    return this;
  }.bind(this);
  return renderer;
};
Overlay.prototype.getCls = function(renderer) {
  var cls = '';
  if (this.visible()) {
    if (this.lastRenderer && renderer === this.lastRenderer.name) {
      cls = this.hiddenCls;
    }
  }
  return cls;
};
Overlay.prototype.dismiss = function() {
  if (this.lastRenderer) {
    this.lastRenderer.fn();
  }
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
  $(cloned).find('[popout-exclude]').remove();
  
  // set the content of the new window
  win.document.body.innerHTML = $(cloned).html();
  
  // copy our stylesheet(s) to the new window
  for (var children = window.document.head.children, i = 0; i < children.length; i++) {
    if (children[i].tagName === "STYLE" && children[i].textContent.indexOf(".wordmapper") >= 0) {
      win.document.head.appendChild(children[i].cloneNode(true)); 
    }
  }
};
Overlay.prototype.import = function() {
  console.log("import");
};

module.exports = Overlay;