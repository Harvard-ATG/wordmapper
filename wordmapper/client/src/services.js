var $ = require('jquery');

var DOM = function() {
  this.$ = $;
};
var Store = function() {
};

module.exports = {
  DOM: new DOM(),
  Store: new Store()
};