var SiteContext = function(options) {
  this.id = options.id || '';
};
SiteContext.prototype.serializeAlignments = function(alignments, serialize) {
  var result = {
    'type': 'site',
    'id': this.id,
    'data': alignments.toJSON()
  };
  return (serialize ? JSON.stringify(result, null, '\t') : result);
};

module.exports = SiteContext;