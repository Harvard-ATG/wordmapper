var events = require('../events.js');

var User = function(options) {
	options = options || {};
	this.id = options.id;
	this.email = options.email;
	this.token = options.token;
};
User.prototype.isAuthenticated = function() {
	return this.token ? true : false;
};
User.prototype.getToken = function() {
	return this.token;
};
User.prototype.update = function(data) {
	var changed = false;
	if (!data) {
		return this;
	}
	
	['id', 'email', 'token'].forEach(function(prop) {
		if(prop in data && data[prop] !== this[prop]) {
			this[prop] = data[prop];
			changed = true;
		}
	}, this);
	
	if(changed) {
		this.triggerChange();
	}
	return this;
};
User.prototype.reset = function() {
	return this.update({id:undefined,email:undefined,token:undefined});
};
User.prototype.saveLogin = function() {
	if (!this.isAuthenticated()) {
		localStorage.removeItem("wordmapper-user");
		return this;
	}
  if (!window.localStorage) {
    return this;
  }
	var data = {
		id: this.id,
		email: this.email,
		token: this.token
	};
	data.expires = new Date();
	data.expires.setHours(data.expires.getHours() + 3);

	localStorage.setItem("wordmapper-user", JSON.stringify(data));

	return this;
};
User.prototype.restoreLogin = function() {
  var result = null;
  if (!window.localStorage) {
    return this;
  }
  result = localStorage.getItem("wordmapper-user");
  if (result === null) {
    return this;
  }
	result = JSON.parse(result);

	var expires = new Date(result.expires);
	var now = new Date();
	if (now >= expires) {
		localStorage.removeItem("wordmapper-user");
		return this;
	}
	this.update(result);

  return this;
};
User.prototype.triggerChange = function() {
	this.trigger("change");
};
User.prototype.toString = function() {
	return this.email || 'guest';
};
User.prototype.toJSON = function() {
	return {
		"type": "user",
		"data": {
			"id": this.id,
			"email": this.email
		}
	};
};
User.prototype.serialize = function() {
  return JSON.stringify(this.toJSON(), null, '\t');
};
events.Events.mixin(User.prototype);

module.exports = User;
