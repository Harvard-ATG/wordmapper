var express = require('express');
var session = require('express-session');
var winston = require('winston');
var passport = require('passport');
var path = require('path');
var http = require('http');
var https = require('https');
var fs = require('fs');

var apiRouter = require('./routes/api');
var adminRouter = require('./routes/admin');
var userRouter = require('./routes/user');
var config = require('./config');
var middleware = require('./middleware');
var utils = require('./utils');
var auth = require('./auth');
var app = express();

// This function starts the app listening on the configured HTTP port.
// If an SSL key and certificate are present, it will also start listening on the
// configured port for HTTPS.
var startServer = function(app) {
	var options = {ssl: false};
	var callback = function(port) {
		return function() {
			winston.info('Listening on port ' + port + '...');
		};
	};

	try {
		options.ssl = {
			key  : fs.readFileSync(path.resolve(__dirname + '/../ssl/server.key')),
			cert : fs.readFileSync(path.resolve(__dirname + '/../ssl/server.crt'))
		};
		winston.info("SSL server key and certificate loaded");
	} catch (e) {
		winston.error("SSL server key and certificate file NOT found!");
		winston.error(e);
	}

  winston.info("Starting server...");
	http.createServer(app).listen(config.port, callback(config.port));
	
	if (options.ssl) {
		https.createServer(options, app).listen(config.portSSL, callback(config.portSSL));
	}
};

utils.configureLogging(winston);
auth.configurePassport(passport);

app.set('view engine', 'ejs'); // set the view engine to ejs
app.set('views', __dirname + '/views'); // set the views directory

app.use(session({
	secret: config.sessionSecret,
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(middleware.requestLogger);
app.use(middleware.commonViewVars);
app.use(middleware.accessControlAllow);

app.use('/static', express.static(__dirname + '/public'));
app.use('/api', apiRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);

app.get('/', function (req, res) {
	var proto = req.get('X-Forwarded-Proto') ? req.get('X-Forwarded-Proto') : req.protocol;
    var baseUrl = proto + '://' + req.get('host');
    res.render('index', {baseUrl: baseUrl});
});

startServer(app);
