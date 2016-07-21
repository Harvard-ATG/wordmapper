var winston = require('winston');

module.exports = {
	accessControlAllow: function(req, res, next) {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS, DELETE');
		res.setHeader('Access-Control-Max-Age', '3600');
		res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
		res.setHeader('Access-Control-Allow-Credentials', true);
		next();
	},
	// Adds values to the response that views can access via "response.locals"
	// http://expressjs.com/en/api.html#res.locals
	commonViewVars: function(req, res, next) {
		// set locals that are available in views
		res.locals.authenticated = req.isAuthenticated();
		res.locals.user = req.user;
		next();
	},
	// Logs information about the HTTP request.
	requestLogger: function(req, res, next) {
		winston.debug('---');
		winston.debug('request:', Date.now(), req.method, req.originalUrl);
		if (Object.keys(req.params).length > 0) {
			winston.debug('request.params:', req.params);
		}
		if (req.body) {
			winston.debug('request.body:', req.body);
		}
		if (req.session) {
			winston.debug('request.session:', req.session);
		}
		if (req.user) {
			winston.debug('request.user:', req.user);
		}
		next();
	}
};
