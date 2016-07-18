var $ = require('jquery');
var events = require('../events.js');
var templates = require('../templates.js');
var LoginComponent = require('./login.js');

var PanelComponent = function(options) {
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
  this.updateLoginButton = this.updateLoginButton.bind(this);
  this.init();
};
PanelComponent.prototype.buttonEvent = {
  'align': events.EVT.ALIGN,
  'clear_highlights': events.EVT.CLEAR_HIGHLIGHTS,
  'clear_alignments': events.EVT.CLEAR_ALIGNMENTS,
  'build_index': events.EVT.BUILD_INDEX,
  'export': events.EVT.EXPORT,
  'login': events.EVT.LOGIN
};
PanelComponent.prototype.init = function() {
  this.el = $('<div>');
  this.addListeners();
};
PanelComponent.prototype.addListeners = function() {
  this.el.on('click', this.onClickButton);
  this.user.on('change', this.updateLoginButton);
};
PanelComponent.prototype.onClickButton = function(evt) {
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
PanelComponent.prototype.render = function() {
  this.el.html(templates.panel(this.tplData));
  this.el.find('.wordmapper-panel').append(this.loginComponent.render().el);
  return this;
};
PanelComponent.prototype.getHeight = function() {
  return this.el.children().outerHeight();
};
PanelComponent.prototype.updateLoginButton = function() {
  var $btn = this.el.find('button[name=login]');
  $btn.find('span').text(this.user.isAuthenticated() ? this.user : 'Account');
};

module.exports = PanelComponent;
