var Alignments = function() {
  this.collection = [];
};
var Alignment = function() {
  this.words = [];
};
var Word = function() {
  this.id = null;
  this.source = null;
};
var Sources = function() {
  this.sources = [];
};
var Source = function() {
  this.hash = null;
  this.normalizedText = null;
};