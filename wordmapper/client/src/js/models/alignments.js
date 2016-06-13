var events = require('../events.js');
var Alignment = require('./alignment.js');

var Alignments = function(options) {
  this.alignments = [];
};
Alignments.prototype.createAlignment = function(words) {
  return new Alignment({id: this.generateId(), words: words});
};
Alignments.prototype.add = function(alignment) {
  this._removeDuplicates(alignment);
  this._removeEmpty();
  this.alignments.push(alignment);
  this.sort();
  this.trigger('change');
};
// If the given alignment contains a word that has already been used in an alignment,
// that should take precedence over any previous usage of that word. So this function
// removes any duplicates in existing alignments.
Alignments.prototype._removeDuplicates = function(given_alignment) {
  this.alignments.forEach(function(alignment) {
    for(var i = 0, words = alignment.words, word; i < words.length; i++) {
      word = words[i];
      if (given_alignment.containsWord(word)) {
        alignment.removeWord(word);
      }
    }
  });
};
Alignments.prototype._removeEmpty = function() {
  this.alignments = this.alignments.filter(function(alignment) {
    return !alignment.isEmpty();
  });
};
Alignments.prototype.remove = function(alignment) {
  var idx = this.alignments.indexOf(alignment);
  if (idx >= 0) {
    this.alignments.splice(idx, 1);
    this.trigger('change');
  }
};
Alignments.prototype.reset = function() {
  this.alignments = [];
  this.trigger('change');
};
Alignments.prototype.sort = function() {
  this.alignments.sort(function(a, b) {
    var word_diff = a.minWordIndex() - b.minWordIndex();
    if (word_diff === 0) {
      return a.minSourceIndex() - b.minSourceIndex();
    } else {
      return word_diff;
    }
  });
};
Alignments.prototype.isEmpty = function() {
  return this.alignments.length === 0;
};
Alignments.prototype.toString = function() {
  return this.alignments.reduce(function(str, alignment) {
    str += alignment.toString();
    return str;
  }, '');
};
Alignments.prototype.toJSON = function(serialize) {
  var alignments = this.alignments.map(function(alignment) {
    return alignment.toJSON();
  });
  var data = {
    'type': 'alignments',
    'data': alignments
  };
  if (serialize) {
    return JSON.stringify(data, null, '\t');
  }
  return data;
};
Alignments.prototype.generateId = (function() {
  var id = 0;
  return function() {
    id++;
    return "local-"+id;
  };
})();
events.Events.mixin(Alignments.prototype);

module.exports = Alignments;