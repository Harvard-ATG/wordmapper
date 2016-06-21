var $ = require('jquery');
var events = require('../events.js');
var templates = require('../templates.js');
var IndexView = require('./overlay/index_view.js');
var ExportView = require('./overlay/export_view.js');

var Overlay = function(options) {
  this.alignments = options.alignments;
  this.importExport = options.importExport;
  this.hiddenCls = 'wordmapper-overlay-hidden';
  this.popout = this.popout.bind(this);
  this.dismiss = this.dismiss.bind(this);
  this.indexView = new IndexView({
    alignments: this.alignments
  });
  this.exportView = new ExportView({
    importExport: this.importExport
  });
  this.init();
};
Overlay.prototype.init = function() {
  this.el = $("<div>").append('<div class="'+this.hiddenCls+'"></div>');
  this.addListeners();
};
Overlay.prototype.addListeners = function() {
  events.hub.on(events.EVT.BUILD_INDEX, function() {
    this.setView(this.indexView).render();
  }.bind(this));

  events.hub.on(events.EVT.EXPORT, function() {
    this.setView(this.exportView).render();
  }.bind(this));

  this.el.on('click', '.wordmapper-popout', null, this.popout);
  this.el.on('click', '.wordmapper-dismiss', null, this.dismiss);
};
Overlay.prototype.visible = function() {
  return this.el.andSelf().find('.' + this.hiddenCls).length === 0;
};
Overlay.prototype.render = function() {
  var hide = true; 
  if (this.visible()) {
    hide = (this.renderer && this.renderer === this.lastRenderer);
  } else {
    hide = this.renderer ? false : true;
  }
  if (this.lastRenderer) {
    this.lastRenderer.el.detach();
  }
  var cls = hide ? this.hiddenCls : '';
  var title = this.renderer ? this.renderer.title : '';
  var canPopout = this.renderer ? this.renderer.canPopout : false;
  this.el.html(templates.overlay({
    cls: cls,
    title: title,
    canPopout: canPopout
  }));
  if (this.renderer && !hide) {
    this.renderer.render();
    this.el.find('.wordmapper-overlay-content').append(this.renderer.el);
  }
  this.lastRenderer = this.renderer;
  return this;
};
Overlay.prototype.setView = function(view) {
  this.renderer = view;
  return this;
};
Overlay.prototype.dismiss = function() {
  this.render();
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

module.exports = Overlay;