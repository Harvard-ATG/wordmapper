var $ = require('jquery');
var events = require('../events.js');
var templates = require('../templates.js');

var PanelComponent = function(options) {
  options = options || {};
  this.el = null;
  this.user = options.user;
  this.settings = options.settings;
  this.tplData = {
    user: this.user
  };
  this.loadCount = 0;
  this.onClickButton = this.onClickButton.bind(this);
  this.updateLoginButton = this.updateLoginButton.bind(this);
  this.onLoading = this.onLoading.bind(this);
  this.notify = this.notify.bind(this);
  this.init();
};
PanelComponent.prototype.buttonEvent = {
  'align': events.EVT.ALIGN,
  'clear_highlights': events.EVT.CLEAR_HIGHLIGHTS,
  'delete_alignments': events.EVT.DELETE_ALIGNMENTS,
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
  events.hub.on(events.EVT.LOADING, this.onLoading);
  events.hub.on(events.EVT.NOTIFICATION, this.notify);
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
    evt.preventDefault();
    evt.stopPropagation();
  }  
};
PanelComponent.prototype.render = function() {
  this.el.html(templates.panel(this.tplData));
  return this;
};
PanelComponent.prototype.getHeight = function() {
  return this.el.children().outerHeight();
};
PanelComponent.prototype.updateLoginButton = function() {
  var $btn = this.el.find('button[name=login]');
  $btn.find('span').text(this.user.isAuthenticated() ? this.user : 'Account');
};
PanelComponent.prototype.onLoading = function(state) {
  var action = false;
  if(state == "start") {
    ++this.loadCount;
    action = (this.loadCount === 1 ? "show" : false);
  } else if (state == "end") {
    --this.loadCount;
    action = (this.loadCount === 0 ? "hide" : false);
  }
  if (action !== false) {
    this.el.find('.wordmapper-loading')[action]();
  }
};
PanelComponent.prototype.notify = function(messageType, message) {
  state = messageType || "success";
  var _this = this;
  var html = templates.notification({
    state: state,
    message: message
  });
  if (this.notifyTimeoutID) {
    window.clearTimeout(this.notifyTimeoutID);
  }
  var $el = this.el.find('.wordmapper-notification');
  $el.html(html).css({opacity: 1});

  this.notifyTimeoutID = setTimeout(function() {
    $el.css({opacity: 0 }); // fade-out
  }, 5000);
};

module.exports = PanelComponent;
