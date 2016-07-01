var winston = require('winston');

module.exports = {
	responseLocals: function(req, res, next) {
		// set locals that are available in views
		res.locals.authenticated = req.isAuthenticated();
		next();
	},
	requestLogger: function(req, res, next) {
		winston.debug('---');
		winston.debug('Request Time:', Date.now());
		winston.debug('Request Type:', req.method);
		winston.debug('Request Url:', req.originalUrl);
		winston.debug('Request Params:', req.params);
		winston.debug('Request Body:', req.body);
		next();
	}
};
