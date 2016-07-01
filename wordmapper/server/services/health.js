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
		function(report) {
			var ok = true;
			report.router = {ok: ok, message: "OK"};
			return ok;
		}
	],
	'check': function() {
		this._checks.forEach(function(check) {
			if(!check(this.report)) {
				this.failures++;
			}
		}, this);
		if(this.failures == 0) {
			this.code = 200;
			this.message = 'All systems go!';
		} else {
			this.code = 500;
			this.message = 'Internal server errors detected. Please check all services.';
		}
		return this;
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
