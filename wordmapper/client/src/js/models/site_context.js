var SiteContext = function(options) {
  this.url = options.url || '';
};
SiteContext.prototype.serializeAlignments = function(alignments, serialize) {
  var result = {};
  result.type = "site";
  result.url = this.url;
  result.data = alignments.toJSON();
  if (serialize) {
    return JSON.stringify(result, null, '\t');
  }
  return result;
};

module.exports = SiteContext;