var express = require('express');
var winston = require('winston');
var apiRouter = require('./routes/api');
var adminRouter = require('./routes/admin');
var healthRouter = require('./routes/health');
var config = require('./config');
var middleware = require('./middleware');
var utils = require('./utils');
var db = require('./db');
var app = express();

utils.configureLogging(winston);

app.set('view engine', 'ejs'); // set the view engine to ejs
app.set('views', __dirname + '/views'); // set the views directory

app.use(middleware.logRequest);
app.use('/static', express.static(__dirname + '/public'));
app.use('/api', apiRouter);
app.use('/health', healthRouter);
app.use('/admin', adminRouter);

app.get('/', function (req, res) {
    var baseUrl = req.protocol + '://' + req.get('host');
    res.render('index', {baseUrl: baseUrl});
});

app.listen(config.port, function () {
  winston.log(config.appName + ' listening on port ' + config.port + '!');
});
