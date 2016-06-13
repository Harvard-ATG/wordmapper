var events = require('../events.js');
var templates = require('../templates.js');

var Panel = function() {
  this.el = null;
  this.onClickButton = this.onClickButton.bind(this);
  this.init();
};
Panel.prototype.init = function() {
  this.el = $('<div>');
  this.addListeners();
};
Panel.prototype.addListeners = function() {
  this.el.on('click', this.onClickButton);
};
Panel.prototype.onClickButton = function(evt) {
  var btnMap = {
    align: events.EVT.ALIGN,
    clear_highlights: events.EVT.CLEAR_HIGHLIGHTS,
    clear_alignments: events.EVT.CLEAR_ALIGNMENTS,
    build_index: events.EVT.BUILD_INDEX,
    export: events.EVT.EXPORT
  };
  var t = evt.target;
  if (t.nodeName == 'BUTTON' && t.name in btnMap) {
    events.hub.trigger(btnMap[t.name]);
  }  
};
Panel.prototype.render = function() {
  this.el.html(templates.panel());
  return this;
};

module.exports = Panel;