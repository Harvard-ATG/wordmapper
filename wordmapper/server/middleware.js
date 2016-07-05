var winston = require('winston');

module.exports = {
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
		winston.debug('Request Time:', Date.now());
		winston.debug('Request Method:', req.method);
		winston.debug('Request Url:', req.originalUrl);
		if (req.params) {
			winston.debug('Request Params:', req.params);
		}
		if (req.body) {
			winston.debug('Request Body:', req.body);
		}
		if (req.session) {
			winston.debug('Request Session:', req.session);
		}
		if (req.user) {
			winston.debug('Request User:', req.user);
		}
		next();
	}
};
