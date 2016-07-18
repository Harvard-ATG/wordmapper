var $ = require('jquery');
var events = require('../events.js');
var templates = require('../templates.js');

var LoginComponent = function(options) {
  options = options || {};
  this.el = null;
  this.user = options.user;
  this.settings = options.settings;
  this.tplData = {
    register_url: this.settings.getRegisterUrl(),
    user: this.user,
    hidden: true,
    error: ''
  };
  this.onClickLogin = this.onClickLogin.bind(this);
  this.onClickLogout = this.onClickLogout.bind(this);
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
};
LoginComponent.prototype.render = function() {
  var html = templates.login(this.tplData);
  this.el.html(html);
  return this;
};
LoginComponent.prototype.onClickLogin = function(evt) {
  var credentials = {};
  credentials.email = this.el.find('input[name=email]').val();
  credentials.password = this.el.find('input[name=password]').val();

  this.authenticate(credentials).done(function(response, textStatus, jqXHR) {
    this.tplData.hidden = true;
    this.tplData.error = '';
    this.user.update(response.data);
    this.render();
  }.bind(this)).fail(function(jqXHR, textStatus, errorThrown) {
    var errStr = errorThrown;
    if (jqXHR.responseJSON && jqXHR.responseJSON.message) {
      errStr = jqXHR.responseJSON.message;
    }
    this.tplData.error = errStr;
    this.render();
  }.bind(this));
  
  evt.stopPropagation();
};
LoginComponent.prototype.onClickLogout = function(evt) {
  this.user.reset();
  this.render();
  evt.stopPropagation();
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

module.exports = LoginComponent;
