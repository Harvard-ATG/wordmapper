var express = require('express');
var session = require('express-session');
var winston = require('winston');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var apiRouter = require('./routes/api');
var adminRouter = require('./routes/admin');
var healthRouter = require('./routes/health');
var userRouter = require('./routes/user');
var config = require('./config');
var middleware = require('./middleware');
var utils = require('./utils');
var query = require('./query');
var app = express();

utils.configureLogging(winston);

passport.use(new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password'
	},
	function(email, password, done) {
		winston.debug("local strategy", {email:email});
		query.users.validatePassword(email, password).then(function(data) {
			winston.debug("validated password success =>", data);
			return done(null, data);
		}).catch(function(err) {
			winston.debug("validate password failure => ", err);
			return done(null, false, { message: 'Authentication failed'});
		});
		//return done(null, false, { message: 'Incorrect username.' });
		//return done(err);
	}
));
passport.serializeUser(function(user, done) {
	winston.debug("serializeUser", user);
	done(null, user.id);
});
passport.deserializeUser(function(id, done) {
	winston.debug("deserializeUser", {id:id});
	query.users.getUserById(id).then(function(user) {
		done(null, user);
	}).catch(function(err) {
		done(err);
	});
});

app.set('view engine', 'ejs'); // set the view engine to ejs
app.set('views', __dirname + '/views'); // set the views directory

app.use(middleware.requestLogger);
app.use(session({
	secret: config.sessionSecret,
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(middleware.responseLocals);

app.use('/static', express.static(__dirname + '/public'));
app.use('/api', apiRouter);
app.use('/health', healthRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);

app.get('/', function (req, res) {
    var baseUrl = req.protocol + '://' + req.get('host');
    res.render('index', {baseUrl: baseUrl});
});

app.listen(config.port, function () {
  winston.log(config.appName + ' listening on port ' + config.port + '!');
});
