var _ = require('lodash');

var Persistence = function(options) {
  options = _.assign({
    stores: ['local'],
    models: {}
  }, options || {});

  this.models = _.assign({}, {
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

  this.onAlignmentsChange = this.onAlignmentsChange.bind(this);
  this.onSourcesChange = this.onSourcesChange.bind(this);
  this.onUserChange = this.onUserChange.bind(this);

  this.init();
};
Persistence.storeFactory = {
  'local': require('./local_storage.js')
};
Persistence.prototype.init = function() {
  this.addListeners();
};
Persistence.prototype.addListeners = function() {
  this.models.alignments.on('change', this.onAlignmentsChange);
  this.models.sources.on('change', this.onSourcesChange);
  this.models.user.on('change', this.onUserChange);
};
Persistence.prototype.onAlignmentsChange = function() {
  console.log("alignments change", this.models.alignments);
};
Persistence.prototype.onSourcesChange = function() {
  console.log("sources change", this.models.sources);
};
Persistence.prototype.onUserChange = function() {
  console.log("user change", this.models.user);
};
Persistence.prototype.load = function() {
  
};
Persistence.prototype.save = function() {
  
};
module.exports = Persistence;