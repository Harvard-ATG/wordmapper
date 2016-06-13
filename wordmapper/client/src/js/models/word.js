var Word = function(options) {
  var self = this;
  ['index', 'source', 'value'].forEach(function(attr) {
    if (options.hasOwnProperty(attr) && options[attr]) {
      self[attr] = options[attr];
    } else {
      throw "Missing required attribute to construct Word: " + attr;
    }
  });
};
Word.prototype.isEqual = function(word) {
  return this.index == word.index && this.source.hash == word.source.hash;
};
Word.create = function(options) {
  return new Word(options);
};
Word.prototype.toString = function() {
  return this.value.toString();
};
Word.prototype.toJSON = function() {
  return {
    'type': 'word',
    'data': {
      'index': this.index,
      'source': (this.source.hash ? this.source.hash : ''),
      'value': this.value
    }
  };
};
Word.prototype.serialize = function() {
  JSON.stringify(this.toJSON(), null, '\t');
};

module.exports = Word;