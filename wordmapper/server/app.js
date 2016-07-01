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
var db = require('./db');
var app = express();

utils.configureLogging(winston);

passport.use(new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password'
	},
	function(email, password, done) {
		winston.debug("local strategy", {email:email});
		return done(null, {id: 1, email:email});
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
	done(null, {id: 1, email: 'a@b.com'});
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
