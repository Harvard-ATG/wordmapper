var db = require('../db');

var HealthService = function(format) {
	this.code = null;
	this.message = '';
	this.failures = 0;
	this.report = {};
};
HealthService.prototype = {
	'_formats': {
		'text':  function(res) { 
			res.send(this.message); 
		},
		'json': function(res) { 
			res.json({ 
				code: this.code, 
				message: this.message, 
				report: this.report 
			}); 
		}
	},
	'_checks': [
		function() {
			this.report.router = {ok: true, message: "OK"};
			return Promise.resolve();
		},
		function() {
			var _this = this;
			return db.db.one('select 1 as value')
				.then(function(data) {
					_this.report.database = {ok: true, message: "OK"};
				}).catch(function(error) {
					_this.failures++;
					_this.report.database = {ok: false, message: "NOT OK", error: error};
				});
		}
	],
	'check': function() {
		var _this = this;
		var promises = _this._checks.map(function(check) {
			return check.call(_this);
		});
		return Promise.all(promises).then(function() {
			if(_this.failures == 0) {
				_this.code = 200;
				_this.message = 'All systems go!';
			} else {
				_this.code = 500;
				_this.message = 'Internal server errors detected. Please check all services.';
			}
		});
	},
	'send': function(res, format) {
		var sender = this._formats.text;
		if(format in this._formats) {
			sender = this._formats[format];
		} 
		sender.call(this, res);
		return this;
	},
	'toString': function() {
		return 'HealthService [' + this.code + '][' + this.message + ']';
	}
};

module.exports = HealthService;
