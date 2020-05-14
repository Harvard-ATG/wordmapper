var Comment = require('./comment.js');

var Alignment = function(options) {
  this.id = options.id;
  this.words = Array.prototype.slice.call(options.words);
  this.comment = options.comment || null;
  if (this.words.length === 0) {
    throw "Invalid alignment: must provide at least one Word object to construct an alignment";
  }
  if (!this.hasValidId()) {
    throw "Invalid alignment: must have an 'id' that is a non-empty string or number";
  }
  this.sort();
};
Alignment.prototype.hasValidId = function() {
  return (typeof this.id === "number" || typeof this.id === "string") && this.id !== "";
};
Alignment.prototype.setComment = function(text) {
  var trimmed_text = text.trim();
  if (trimmed_text) {
    this.comment = new Comment({ text: trimmed_text });
  } else {
    this.comment = null;
  }
  return this;
};
Alignment.prototype.containsWord = function(word) {
  return this.findWord(word) !== false;
};
Alignment.prototype.findWord = function(word) {
  for(var index = 0; index < this.words.length; index++) {
    if (word.isEqual(this.words[index])) {
      return {word: this.words[index], index: index};
    }
  }
  return false;
};
Alignment.prototype.removeWord = function(word) {
  var found = this.findWord(word);
  if (found !== false) {
    this.words.splice(found.index, 1);
    return true;
  }
  return false;
};
Alignment.prototype.sort = function() {
  this.words.sort(function(a, b) {
    if (a.source.index == b.source.index) {
      return a.index - b.index;
    } else {
      return a.source.index - b.source.index;
    }
  });
};
Alignment.prototype.minWordIndex = function() {
  return Math.min.apply(Math, this.words.map(function(word) {
    return word.index;
  }));
};
Alignment.prototype.minSourceIndex = function() {
  return Math.min.apply(Math, this.words.map(function(word) {
    return word.source.index;
  }));
};
Alignment.prototype.size = function() {
  return this.words.length;
};
Alignment.prototype.isEmpty = function() {
  return this.words.length === 0;
};
Alignment.prototype.wordsBySourceIndex = function() {
  var by_source = {};
  for(var i = 0, word; i < this.words.length; i++) {
    word = this.words[i];
    if (!by_source[word.source.index]) {
      by_source[word.source.index] = [];
    }
    by_source[word.source.index].push(word);
  }
  return by_source;
};
Alignment.prototype.wordGroups = function() {
  var by_source = this.wordsBySourceIndex() || {};
  var sources = Object.keys(by_source);
  var groups = [];
  for(i = 0; i < sources.length; i++) {
    groups[i] = by_source[sources[i]];
  }
  return groups;
};
Alignment.prototype.toString = function() {
  return this.wordGroups().map(function(group) {
    return group.join(' ');
  }).join(' - ');
};
Alignment.prototype.toJSON = function() {
  var result = {
    "type": "alignment",
    "data": this.words.map(function(word) {
      return word.toJSON();
    })
  };
  if (this.comment !== null) {
    result.data.push(this.comment.toJSON());
  }
  return result;
};
Alignment.prototype.serialize = function() {
  return JSON.stringify(this.toJSON(), null, '\t');
};

module.exports = Alignment;