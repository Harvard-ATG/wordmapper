var sha1 = require('sha1');
var events = require('./events.js');

//---------------------------------------------------------------------
var Alignments = function(options) {
  this.alignments = [];
};
Alignments.prototype.createAlignment = function(words) {
  return new Alignment({id: this.generateId(), words: words});
};
Alignments.prototype.add = function(alignment) {
  this.removeDuplicates(alignment);
  this.removeEmpty();
  this.alignments.push(alignment);
  this.sort();
  this.trigger('change');
};
// If the given alignment contains a word that has already been used in an alignment,
// that should take precedence over any previous usage of that word. So this function
// removes any duplicates in existing alignments.
Alignments.prototype.removeDuplicates = function(given_alignment) {
  this.alignments.forEach(function(alignment) {
    for(var i = 0, words = alignment.words, word; i < words.length; i++) {
      word = words[i];
      if (given_alignment.containsWord(word)) {
        alignment.removeWord(word);
      }
    }
  });
};
Alignments.prototype.removeEmpty = function() {
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

//---------------------------------------------------------------------
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

//---------------------------------------------------------------------
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
  var data = {
    'type': 'word',
    'data': {
      'index': this.index,
      'source': (this.source.hash ? this.source.hash : ''),
      'value': this.value
    }
  };
  return data;
};
//---------------------------------------------------------------------
var Source = function(options) {
  this.el = options.el;
  this.index = options.index;
  if (!this.el) {
    throw "Invalid Source: required 'el' attribute";
  }
  if (this.index === "" || isNaN(Number(this.index))) {
    throw "Invalid Source: required 'index' attribute must be a valid number";
  }
  this.normalizedText = this.el.textContent.replace(/\s+/g, ' ').trim();
  this.hash = sha1(this.normalizedText);
  this.nextWordIndex = this.createWordIndexer();
};
Source.fromDOM = function(el, index) {
  return new Source({ el: el.cloneNode(true), index: index });
};
Source.fromHTML = function(html, index) {
  var temp = document.createElement('template');
  temp.innerHTML = html;
  var fragment = temp.content;
  return new Source({ el: fragment, index: index });
};
Source.createWords = function(spans, sources) {
  var source_dict = sources.reduce(function(dict, source) {
    dict[source.index] = source;
    return dict;
  }, {});
  return spans.map(function(span) {
    return Word.create({
      index: span.dataset.word,
      source: source_dict[span.dataset.source],
      value: span.textContent
    });
  });
};
Source.prototype.copyElement = function() {
  return this.el.cloneNode(true);
};
Source.prototype.containsSpans = function(el) {
  return $(this.el).find('.wordmapper-word').length > 0;
};
Source.prototype.transform = function() {
  if (this.containsSpans()) { return this; }

  var callback = function(node) {
    this.transformTextNode(this.index, node);
  }.bind(this);

  this.traverse(this.el, callback);

  return this;
};
Source.prototype.traverse = function(node, callback) {
  var children = Array.prototype.slice.call(node.childNodes);
  for(var i = 0; i < children.length; i++) {
    this.traverse(children[i], callback);
  }
  if (node.nodeType == 3) {
    callback(node);
  }
};
Source.prototype.transformTextNode = function(sourceIndex, textNode) {
  var makeSpan = function(word) {
    return this.makeSpan(word, this.nextWordIndex(), sourceIndex);
  }.bind(this);

  var spans = this.textToWords(textNode.nodeValue).map(makeSpan);

  var span = spans.reduce(function(parentSpan, currentSpan, index) {
    parentSpan.appendChild(currentSpan);
    parentSpan.appendChild(document.createTextNode(" "));
    return parentSpan;
  }, document.createElement("span"));

  textNode.parentNode.replaceChild(span, textNode);
};
Source.prototype.textToWords = function(text) {
  return text.split(/\s+/).filter(function(word) {
    return word.length > 0;
  });
};
Source.prototype.makeSpan = function(word, wordIndex, sourceIndex) {
  var span = document.createElement('span');
  span.className = 'wordmapper-word';
  span.innerHTML = word;
  span.dataset.word = wordIndex;
  span.dataset.source = sourceIndex;
  return span;
};
Source.prototype.createWordIndexer = function() {
  var index = 0;
  return function() {
    return index++;
  };
};

//---------------------------------------------------------------------
var SiteContext = function(options) {
  this.url = options.url;
};

module.exports = {
  Alignments: Alignments,
  Source: Source,
  SiteContext: SiteContext
};