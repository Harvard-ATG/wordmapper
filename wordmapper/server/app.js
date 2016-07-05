var express = require('express');
var session = require('express-session');
var winston = require('winston');
var passport = require('passport');

var apiRouter = require('./routes/api');
var adminRouter = require('./routes/admin');
var healthRouter = require('./routes/health');
var userRouter = require('./routes/user');
var config = require('./config');
var middleware = require('./middleware');
var utils = require('./utils');
var auth = require('./auth');
var query = require('./query');
var app = express();

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
