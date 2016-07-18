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
User.prototype.update = function(data) {
	var changed = false;

	['id', 'email', 'token'].forEach(function(prop) {
		if(prop in data && data[prop] && data[prop] !== this[prop]) {
			this[prop] = data[prop];
			changed = true;
		}
	}, this);

	if(changed) {
		this.triggerChange();
	}
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
