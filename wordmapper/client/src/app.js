require('./css/style.css');
var $ = require('jquery');

if (window.WordMapper) {
  console.log("WordMapper already loaded! To reload the bookmarklet,please refresh the page.");
} else {
  $(document).ready(function() {
    var components = require('./js/components.js');
    var app = new components.Application();
    $("body").append(app.render().el);
    window.WordMapper = app;
  });
}
