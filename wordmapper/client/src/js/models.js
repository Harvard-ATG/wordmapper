//---------------------------------------------------------------------
var Alignments = function() {
  this.alignments = [];
};
Alignments.prototype.createAlignment = function(words) {
  return new Alignment({id: this.nextId(), words: words});
};
Alignments.prototype.add = function(alignment) {
  this.alignments.push(alignment);
};
Alignments.prototype.remove = function(alignment) {
  var idx = this.alignments.indexOf(alignment);
  if (idx >= 0) {
    this.alignments.splice(idx, 1);
  }
};
Alignments.prototype.reset = function() {
  this.alignments = [];
};
Alignments.prototype.toString = function() {
  return this.alignments.reduce(function(str, alignment) {
    str += alignment.toString();
    return str;
  }, '');
};
Alignments.prototype.nextId = (function() {
  var id = 0;
  return function() {
    id++;
    return id;
  };
})();

//---------------------------------------------------------------------
var Alignment = function(options) {
  this.id = options.id;
  this.words = Array.prototype.slice.call(options.words);
};
Alignment.prototype.toString = function() {
  return this.words.reduce(function(str, word) {
    str += word.toString() + " ";
    return str;
  }, '');
};

//---------------------------------------------------------------------
var Word = function(options) {
  var self = this;
  ['id', 'source', 'value'].forEach(function(attr) {
    if (options.hasOwnProperty(attr) && options[attr]) {
      self[attr] = options[attr];
    } else {
      throw "Missing required attribute to construct Word: " + attr;
    }
  });
};
Word.get = function(options) {
  return new Word(options);
};
Word.prototype.toString = function() {
  return this.value;
};

//---------------------------------------------------------------------
var Source = function(options) {
  this.el = options.el;
  this.normalizedText = this.el.textContent.replace(/\s+/g, ' ').trim();
  this.sourceId = Source.instances++;
  this.textHash = null;
};
Source.instances = 0;
Source.fromDOM = function(el) {
  return new Source({ el: el.cloneNode(true) });
};
Source.fromHTML = function(html) {
  var temp = document.createElement('template');
  temp.innerHTML = html;
  var fragment = temp.content;
  return new Source({ el: fragment });
};
Source.createWords = function(spans, sources) {
  var source_for = {};
  sources.forEach(function(source) {
    source_for[source.sourceId] = source;
  });
  return spans.map(function(span) {
    return Word.get({
      id: span.dataset.word,
      source: source_for[span.dataset.source],
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
    this.transformTextNode(this.sourceId, node);
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
Source.prototype.transformTextNode = function(sourceId, textNode) {
  var makeSpan = function(word) {
    return this.makeSpan(word, this.nextWordId(), sourceId);
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
Source.prototype.makeSpan = function(word, wordId, sourceId) {
  var span = document.createElement('span');
  span.className = 'wordmapper-word';
  span.innerHTML = word;
  span.dataset.word = wordId;
  span.dataset.source = sourceId;
  return span;
};
Source.prototype.nextWordId = (function() {
  var wordId = 0;
  return function() {
    return wordId++;
  };
})();

//---------------------------------------------------------------------
var SiteContext = function(options) {
  this.url = options.url;
  this.pageContent = options.content;
};

module.exports = {
  Alignments: Alignments,
  Source: Source
};