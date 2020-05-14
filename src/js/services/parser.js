var models = require('../models.js');
var Word = models.Word;
var Alignments = models.Alignments;

var AlignmentsParser = function(data, sources) {
  this.input = data;
  this.sources = sources;
  this.output = null;
};
AlignmentsParser.prototype.parse = function() {
  if (typeof this.input === "string") {
    this.input = JSON.parse(this.input);
  }
  this.output = this._parse();
  return this;
};
AlignmentsParser.prototype._parse = function() {
  var sourceMap = this.sources.getSourceHashMap();

  return this.input.data.map(function(alignment) {
    var words = alignment.data.filter(function(item) {
      return item.type == 'word';
    }).map(function(word) {
      return Word.create({
        index: word.data.index,
        value: word.data.value,
        source: sourceMap[word.data.source]
      });
    });
    var comment_texts = alignment.data.filter(function(item) {
      return item.type == 'comment';
    }).map(function(comment) {
      return comment.data.text;
    });
    return Alignments.createAlignment(words).setComment(comment_texts.join(" "));
  });
};

module.exports.AlignmentsParser = AlignmentsParser;
