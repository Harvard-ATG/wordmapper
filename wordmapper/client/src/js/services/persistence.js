var _ = require('lodash');

var Persistence = function(options) {
  options = _.assign({
    stores: ['local'],
    models: {}
  }, options || {});

  this.models = _.assign({
    user: null,
    alignments: null,
    siteContext: null,
    sources: null
  }, options.models || {});

  this.stores = options.stores.map(function(store) {
    if (store in Persistence.storeFactory) {
      return new Persistence.storeFactory[store](this);
    } else {
      console.log("Invalid store type: ", store);
    }
    return false;
  }, this).filter(Boolean);

  this.init();
};
Persistence.storeFactory = {
  'local': require('./local_storage.js')
};
Persistence.prototype.init = function() {
  this.addListeners();
};
Persistence.prototype.addListeners = function() {
  
};
module.exports = Persistence;