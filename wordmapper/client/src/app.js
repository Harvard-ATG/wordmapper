require('./css/style.css');
var $ = require('jquery');
var components = require('./js/components.js');
var global = window || {}; 
var app = null;

if (global.WordMapper) {
  console.log("WordMapper already loaded! To reload the bookmarklet,please refresh the page.");
} else {
    app = new components.Application();
    app.renderTo("body");
    global.WordMapper = app;
}

module.exports = global.WordMapper;
