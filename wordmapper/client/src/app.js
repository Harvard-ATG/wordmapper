require('jquery');
require('./css/style.css');

var components = require('./js/components.js');

if (window.WordMapper) {
  console.log("WordMapper already loaded! To reload the bookmarklet,please refresh the page.");
} else {
  var app = new components.Application();
  window.WordMapper = app;
}
