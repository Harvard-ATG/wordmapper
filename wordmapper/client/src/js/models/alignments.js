var events = require('../events.js');
var Alignment = require('./alignment.js');

var Alignments = function(options) {
  this.alignments = [];
};
Alignments.generateId = (function() {
  var id = 0;
  return function() {
    id++;
    return "local-"+id;
  };
})();
Alignments.createAlignment = Alignments.prototype.createAlignment = function(words) {
  return new Alignment({
    id: Alignments.generateId(),
    words: words
  });
};
Alignments.prototype.triggerChange = function() {
  this.trigger("change");
};
Alignments.prototype.triggerLoad = function() {
  this.trigger("load");
};
Alignments.prototype.triggerReset = function() {
  this.trigger("reset");
};
Alignments.prototype.add = function(alignment) {
  this.removeDuplicates(alignment);
  this.removeEmpty();
  this.alignments.push(alignment);
  this.sort();
  this.triggerChange();
};
// This function ensures that a word belongs to a *single* alignment. So given an alignment,
// ensure that its words have not already been used in other alignments. If they have been used,
// remove them, otherwise no action is required. 
Alignments.prototype.removeDuplicates = function(given_alignment) {
  var num_words_removed = 0;
  this.alignments.forEach(function(alignment) {
    for(var i = 0, words = alignment.words, word, removed; i < words.length; i++) {
      word = words[i];
      if (given_alignment.containsWord(word)) {
        removed = alignment.removeWord(word);
        if (removed) {
          ++num_words_removed;
        }
      }
    }
  });
  return num_words_removed;
};
Alignments.prototype.removeEmpty = function() {
  this.alignments = this.alignments.filter(function(alignment) {
    return !alignment.isEmpty();
  });
};
Alignments.prototype.removeWord = function(id, word) {
  var alignment = this.findById(id);  
  if (alignment !== false) {
    return alignment.removeWord(word);
  }
  return false;
};
Alignments.prototype.remove = function(alignment) {
  var idx = this.alignments.indexOf(alignment);
  if (idx >= 0) {
    this.alignments.splice(idx, 1);
    this.triggerChange();
  }
};
Alignments.prototype.reset = function() {
  this.alignments = [];
  this.triggerReset();
};
Alignments.prototype.load = function(alignments) {
  this.alignments = Array.prototype.slice.call(alignments);
  this.sort();
  this.triggerLoad();
  return this;
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
Alignments.prototype.findById = function(id) {
  var items = this.alignments;
  var found = false;
  for(var i = 0, len = items.length; i < len; i++) {
    if (items[i].id == id) {
      found = items[i];
      break;
    }
  }
  return found;
};
Alignments.prototype.maxWords = function() {
  return this.alignments.reduce(function(max, alignment) {
    var size = alignment.size();
    return max >= size ? max : size;
  }, 0);
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
Alignments.prototype.toJSON = function() {
  return {
    'type': 'alignments',
    'data': this.alignments.map(function(alignment) {
      return alignment.toJSON();
    })
  };
};
Alignments.prototype.serialize = function() {
  return JSON.stringify(this.toJSON(), null, '\t');
};

// convenience methods to operate on the underlying objects by callers...
['map', 'forEach', 'reduce', 'filter'].forEach(function(method) {
  Alignments.prototype[method] = function() {
    return Array.prototype[method].apply(this.alignments, arguments);
  };
});

events.Events.mixin(Alignments.prototype);

module.exports = Alignments;