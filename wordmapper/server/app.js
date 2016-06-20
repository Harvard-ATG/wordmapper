var express = require('express');
var app = express();

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8000;

// set the views directory
app.set('views', __dirname + '/views');

// set the view engine to ejs
app.set('view engine', 'ejs');

// make express look in the public directory for assets (css/js/img)
app.use('/static', express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    // ejs render automatically looks in the views folder
    res.render('index');
});

app.listen(port, function () {
  console.log('Word Mapper listening on port ' + port + '!');
});
