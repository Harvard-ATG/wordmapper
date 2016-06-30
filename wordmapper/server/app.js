var express = require('express');
var apiRouter = require('./routes/api');
var adminRouter = require('./routes/admin');
var healthRouter = require('./routes/health');
var config = require('./config');
var app = express();
var port = process.env.PORT || config.port;

app.set('view engine', 'ejs'); // set the view engine to ejs
app.set('views', __dirname + '/views'); // set the views directory

app.use('/static', express.static(__dirname + '/public'));
app.use('/api', apiRouter);
app.use('/health', healthRouter);
app.use('/admin', adminRouter);

app.get('/', function (req, res) {
    var baseUrl = req.protocol + '://' + req.get('host');
    var context = {baseUrl: baseUrl};
    res.render('index', context);
});

app.listen(port, function () {
  console.log(config.appName + ' listening on port ' + port + '!');
});
