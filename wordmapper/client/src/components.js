var events = require('./events.js');
var services = require('./services.js');

var DOM = services.DOM;

var Application = function() {
  this.init();
};
Application.prototype.init = function() {
  var sidebar = new Sidebar();
  sidebar.render();
};

var Sidebar = function() {
  this.el = null;
  this.init();
};
Sidebar.prototype.init = function() {
  this.el = DOM.$('<div id="wordmapper-overlay">').appendTo("body");
};
Sidebar.prototype.render = function() {
  this.el.html([
    '<div id="wordmapper-overlay-toolbar">',
      '<button title="Toggle Sidebar">&gt;</button>',
    '</div>'
  ].join(''));
};

module.exports = {
    Application: Application,
    Sidebar: Sidebar
};