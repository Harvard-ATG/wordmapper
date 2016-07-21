var $ = require('jquery');
var templates = require('../../templates.js');

var IndexView = function(options) {
  this.alignments = options.alignments;
  this.sources = options.sources;
  this.render = this.render.bind(this);
  this.onClickComment = this.onClickComment.bind(this);
  this.processComment = this.processComment.bind(this);
  this.title = "Index";
  this.canPopout = true;
  this.init();
};

IndexView.prototype.init = function() {
  this.el = $("<div/>");
  this.addListeners();
};
IndexView.prototype.addListeners = function() {
  this.el.on('click', 'button[name=action_comment]', null, this.onClickComment);
};
IndexView.prototype.onClickComment = function(evt) {
  var btnEl = evt.target;
  this.toggleComments(btnEl);
};
IndexView.prototype.toggleComments = function(btnEl) {
  var $rows = this.el.find('tr.comment');
  var $textareas = this.el.find('textarea.comment');
  var $spans = this.el.find('span.comment');
  var $btnEl = $(btnEl);
  var btnText = $btnEl.text();
  var texts = $btnEl.data("toggle-text").split(",");

  if (btnText === texts[0]) {
    $btnEl.text(texts[1]);
    $spans.hide();
    $textareas.show();
    $rows.show();
  } else {
    $btnEl.text(texts[1]);
    $textareas.each(this.processComment);
    this.alignments.triggerChange();
    this.render();
  }
};
IndexView.prototype.processComment = function(index, el) {
  var alignment_id = $(el).data("alignment");
  var text = $(el).val();
  var alignment_obj = this.alignments.findById(alignment_id);
  if (alignment_obj !== false) {
    alignment_obj.setComment(text);
  }
};
IndexView.prototype.getAlignmentsBySource = function() {
  var sources = this.sources;
  return this.alignments.map(function(alignment) {
    var words_by_source = alignment.wordsBySourceIndex();
    return {
      alignment: alignment,
      buckets: sources.map(function(source) {
        if (words_by_source.hasOwnProperty(source.index)) {
          return words_by_source[source.index];
        }
        return [];
      })
    };
  });
};
IndexView.prototype.getAlignmentsByWords = function() {
  return this.alignments.map(function(alignment) {
    return {
      alignment: alignment,
      buckets:  alignment.wordGroups()
    };
  });
};
IndexView.prototype.render = function() {
  var template = templates.index;
  var indexData = this.getAlignmentsByWords();
  var maxBuckets = indexData.reduce(function(size, alignmentData) {
    return Math.max(size, alignmentData.buckets.length);
  }, 0);
  var html = template({
    alignments: this.alignments,
    indexData: indexData,
    maxBuckets: maxBuckets,
    commentsPosition: "right"
  });
  this.el.html(html);
  return this;
};

module.exports = IndexView;

