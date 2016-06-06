require('./style.css');
require('jquery');
events = require('./events.js');
controllers = require('./controllers.js');

var app = new controllers.Application();
app.run();

events.hub.trigger('loaded');

var output = "Hello, World! xxxxx.";
$('<div id="wordmapper-overlay">').html("Bookmarklet Activated!").appendTo($("body"));
console.log(output);

