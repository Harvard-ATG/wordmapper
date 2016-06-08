var events = require('./events.js');
var services = require('./services.js');
var templates = require('./templates.js');

//---------------------------------------------------------------------
var Application = function() {
  this.init();
};
Application.prototype.init = function() {
  var panel = new Panel();
  panel.render();
};

//---------------------------------------------------------------------
var Panel = function() {
  this.el = null;
  this.init();
};
Panel.prototype.init = function() {
  this.el = $('<div>').appendTo("body");
  this.onClickButton = this.onClickButton.bind(this);
  this.addListeners();
};
Panel.prototype.addListeners = function() {
  this.el.on('click', this.onClickButton);
};
Panel.prototype.onClickButton = function(evt) {
  var btnMap = {
    align: 'ALIGN',
    clear_highlights: 'CLEAR_HIGHLIGHTS',
    build_index: 'BUILD_INDEX'
  };
  var t = evt.target;
  if (t.nodeName == 'BUTTON' && t.name in btnMap) {
    events.hub.trigger(btnMap[t.name]);
  }  
};
Panel.prototype.render = function() {
  this.el.html(templates.panel());
};

//---------------------------------------------------------------------
module.exports = {
    Application: Application,
    Panel: Panel
};