var express = require('express');
var app = express();

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 80;

app.use('/static', express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.send('Word Mapper says: Hello World!');
});

app.listen(port, function () {
  console.log('Word Mapper listening on port 80!');
});
