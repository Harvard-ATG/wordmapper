var SiteContext = function(options) {
  this.id = options.id || '';
  this.url = options.url || '';
};
SiteContext.prototype.serializeAlignments = function(alignments, serialize) {
  var result = {
    'type': 'site',
    'id': this.id,
    'url': this.url,
    'data': alignments.toJSON()
  };
  return (serialize ? JSON.stringify(result, null, '\t') : result);
};

module.exports = SiteContext;