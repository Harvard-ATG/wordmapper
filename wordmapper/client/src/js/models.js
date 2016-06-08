//---------------------------------------------------------------------
var Alignments = function() {
  this.alignments = [];
};
Alignments.prototype.createAlignment = function(words) {
  return new Alignment(words);
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

//---------------------------------------------------------------------
var Alignment = function(words) {
  this.words = Array.prototype.slice.call(words);
};
Alignment.prototype.toString = function() {
  return this.words.reduce(function(str, word) {
    str += word.toString();
    return str;
  }, '');
};

//---------------------------------------------------------------------
var Word = function() {
  this.id = null;
  this.position = null;
  this.source = null;
  this.value = '';
};
Word.prototype.toString = function() {
  return this.value;
};

//---------------------------------------------------------------------
var Sources = function() {
  this.sources = [];
};
Sources.prototype.createSource = function(text, position) {
  return new Source(text, position);
};
Sources.prototype.add = function(source) {
  this.sources.push(source);
};

//---------------------------------------------------------------------
var Source = function(text, position) {
  this.position = null;
  this.normalizedText = '';
  this.hash = '';
};

module.exports = {
  Alignments: Alignments,
  Sources: Sources
}