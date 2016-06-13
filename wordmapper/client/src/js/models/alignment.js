var Alignment = function(options) {
  this.id = options.id;
  this.words = Array.prototype.slice.call(options.words);
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
  }
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
Alignment.prototype.wordGroups = function() {
  var word_groups = {};
  var sources = [], groups = [];
  for(var i = 0, word; i < this.words.length; i++) {
    word = this.words[i];
    if (!word_groups[word.source.index]) {
      sources.push(word.source.index);
      word_groups[word.source.index] = [];
    }
    word_groups[word.source.index].push(word);
  }
  for(i = 0; i < sources.length; i++) {
    groups[i] = word_groups[sources[i]];
  }
  return groups;
};
Alignment.prototype.toString = function() {
  return this.wordGroups().map(function(group) {
    return group.join(' ');
  }).join(' - ');
};
Alignment.prototype.toJSON = function() {
  var words = this.words.map(function(word) {
    return word.toJSON();
  });
  var data = {
    "type": "alignment",
    "data": words
  };
  return data;
};

module.exports = Alignment;