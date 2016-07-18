var User = function(options) {
	options = options || {};
	this.id = options.id;
	this.email = options.email;
	this.token = options.token;
};
User.prototype.isAuthenticated = function() {
	return this.token ? true : false;
};
User.prototype.setToken = function(token) {
	this.token = token;
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

module.exports = User;
