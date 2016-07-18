var $ = require('jquery');
var events = require('../events.js');
var templates = require('../templates.js');
var LoginComponent = require('./login.js');

var Panel = function(options) {
  options = options || {};
  this.el = null;
  this.user = options.user;
  this.settings = options.settings;
  this.loginComponent = new LoginComponent({
    user: this.user,
    settings: this.settings
  });
  this.tplData = {
    user: this.user
  };
  this.onClickButton = this.onClickButton.bind(this);
  this.init();
};
Panel.prototype.buttonEvent = {
  'align': events.EVT.ALIGN,
  'clear_highlights': events.EVT.CLEAR_HIGHLIGHTS,
  'clear_alignments': events.EVT.CLEAR_ALIGNMENTS,
  'build_index': events.EVT.BUILD_INDEX,
  'export': events.EVT.EXPORT,
  'login': events.EVT.LOGIN
};
Panel.prototype.init = function() {
  this.el = $('<div>');
  this.addListeners();
};
Panel.prototype.addListeners = function() {
  this.el.on('click', this.onClickButton);
};
Panel.prototype.onClickButton = function(evt) {
  var t = evt.target, can_trigger_event = true;
  
  // this handles the case where an icon is clicked (get the parent button)
  if (t.nodeName != 'BUTTON' && t.parentNode.nodeName == 'BUTTON') {
    t = t.parentNode;
  }
  
  // check if the node is a valid button, in which case broadcast an event
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
  console.log("render panel");
  this.el.html(templates.panel(this.tplData));
  this.el.find('.wordmapper-panel').append(this.loginComponent.render().el);
  return this;
};
Panel.prototype.getHeight = function() {
  return this.el.children().outerHeight();
};

module.exports = Panel;
