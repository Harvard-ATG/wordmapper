var events = require('../events.js');
var templates = require('../templates.js');

var Panel = function() {
  this.el = null;
  this.onClickButton = this.onClickButton.bind(this);
  this.init();
};
Panel.prototype.buttonEvent = {
  'align': events.EVT.ALIGN,
  'clear_highlights': events.EVT.CLEAR_HIGHLIGHTS,
  'clear_alignments': events.EVT.CLEAR_ALIGNMENTS,
  'build_index': events.EVT.BUILD_INDEX,
  'export': events.EVT.EXPORT
};
Panel.prototype.init = function() {
  this.el = $('<div>');
  this.addListeners();
};
Panel.prototype.addListeners = function() {
  this.el.on('click', this.onClickButton);
};
Panel.prototype.onClickButton = function(evt) {
  var t = evt.target;
  var can_trigger_event = true;
  if (t.nodeName == 'BUTTON' && t.name in this.buttonEvent) {
    if (t.dataset.confirm) {
      can_trigger_event = window.confirm(t.dataset.confirm);
    }
    if (can_trigger_event) {
      events.hub.trigger(this.buttonEvent[t.name]);
    }
  }  
};
Panel.prototype.render = function() {
  this.el.html(templates.panel());
  return this;
};

module.exports = Panel;