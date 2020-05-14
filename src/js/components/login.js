var $ = require('jquery');
var events = require('../events.js');
var templates = require('../templates.js');

// NOTE: this component is deprecated in v2.0 -- should be removed
var LoginComponent = function(options) {
  options = options || {};
  this.el = null;
  this.user = options.user;
  this.settings = options.settings;
  this.tplData = {
    register_url: this.settings.getRegisterUrl(),
    base_url: this.settings.getBaseUrl(),
    user: this.user,
    hidden: true,
    error: ''
  };
  this.onClickLogin = this.onClickLogin.bind(this);
  this.onClickLogout = this.onClickLogout.bind(this);
  this.onKeyDown = this.onKeyDown.bind(this);
  this.init();
};
LoginComponent.prototype.init = function() {
  this.el = $('<div>');
  this.addListeners();
};
LoginComponent.prototype.addListeners = function() {
  events.hub.on(events.EVT.LOGIN, function() {
    var $el = this.el.find('.wordmapper-account');
    var hidden = this.tplData.hidden;
    this.tplData.hidden = !hidden;
    $el[hidden?'show':'hide']();
  }.bind(this));

  this.el.on('click', 'button[name=login]', null, this.onClickLogin);
  this.el.on('click', 'button[name=logout]', null, this.onClickLogout);
  this.el.on('keydown', 'input', null, this.onKeyDown);
};
LoginComponent.prototype.render = function() {
  var html = templates.login(this.tplData);
  this.el.html(html);
  return this;
};
LoginComponent.prototype.onClickLogin = function(evt) {
  evt.stopPropagation();
  this.login(this.credentials());
};
LoginComponent.prototype.onClickLogout = function(evt) {
  evt.stopPropagation();
  this.logout();
};
LoginComponent.prototype.onKeyDown = function(evt) {
  var keyCode = evt.keyCode || evt.which;
  var enterKey = 13;
  if (keyCode == enterKey) {
    if(this.user.isAuthenticated()) {
      this.logout();
    } else {
      this.login(this.credentials());
    }
  }
};
LoginComponent.prototype.login = function(credentials) {
  this.startLogin();
  return this.authenticate(credentials).done(function(response, textStatus, jqXHR) {
    this.user.update(response.data);
    this.user.saveLogin();
    this.tplData.hidden = true;
    this.tplData.error = '';
    this.render();
  }.bind(this)).fail(function(jqXHR, textStatus, errorThrown) {
    var errStr = errorThrown;
    if (jqXHR.responseJSON && jqXHR.responseJSON.message) {
      errStr = jqXHR.responseJSON.message;
    }
    this.tplData.error = errStr;
    this.render();
  }.bind(this)).always(function() {
    this.endLogin();
  }.bind(this));
};
LoginComponent.prototype.logout = function() {
  this.user.reset();
  this.user.saveLogin();
  this.render();
};
LoginComponent.prototype.authenticate = function(credentials) {
  var url = this.settings.getAPIBaseUrl() + '/auth/login';
  return $.ajax({
    dataType: "json",
    method: 'POST',
    url: url,
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(credentials)
  });
};
LoginComponent.prototype.credentials = function() {
  var credentials = {};
  credentials.email = this.el.find('input[name=email]').val();
  credentials.password = this.el.find('input[name=password]').val();
  return credentials;
};
LoginComponent.prototype.startLogin = function() {
  events.hub.trigger(events.EVT.LOADING, "start", "login");
};
LoginComponent.prototype.endLogin = function() {
  events.hub.trigger(events.EVT.LOADING, "end", "login");
};


module.exports = LoginComponent;
