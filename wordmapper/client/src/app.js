require('jquery');
require('./css/style.css');

if (window.WordMapper) {
  console.log("WordMapper already loaded! To reload the bookmarklet,please refresh the page.");
} else {
  var components = require('./js/components.js');
  var app = new components.Application();
  app.render();
  window.WordMapper = app;
}
