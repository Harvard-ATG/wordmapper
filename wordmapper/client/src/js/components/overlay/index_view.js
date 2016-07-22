var $ = require('jquery');
var templates = require('../../templates.js');

var IndexView = function(options) {
  this.alignments = options.alignments;
  this.sources = options.sources;
  this.render = this.render.bind(this);
  this.onClickEditAll = this.onClickEditAll.bind(this);
  this.onClickCancel = this.onClickCancel.bind(this);
  this.onClickSave = this.onClickSave.bind(this);
  this.processComment = this.processComment.bind(this);
  this.onClickEditSingle = this.onClickEditSingle.bind(this);
  this.title = "Index";
  this.canPopout = true;
  this.init();
};

IndexView.prototype.init = function() {
  this.el = $("<div/>");
  this.addListeners();
};
IndexView.prototype.addListeners = function() {
  this.el.on('click', '[data-name=action_edit_all]', null, this.onClickEditAll);
  this.el.on('click', '[data-name=action_edit_single]', null, this.onClickEditSingle);
  this.el.on('click', 'button[name=cancel]', null, this.onClickCancel);
  this.el.on('click', 'button[name=save]', null, this.onClickSave);
};
IndexView.prototype.getActionButtons = function(selector) {
  return $(selector || this.el).find('[data-name=action_buttons]');
};
IndexView.prototype.getActionEditAll = function(selector) {
  return $(selector || this.el).find('[data-name=action_edit_all]');
};
IndexView.prototype.getTextareas = function(selector) {
  return $(selector || this.el).find('textarea.comment');
};
IndexView.prototype.onClickEditAll = function(evt) {
  this.editComments(true);
  evt.stopPropagation();
};
IndexView.prototype.onClickEditSingle = function(evt) {
  var $comment = $(evt.target).closest('td.comment');
  this.editComment($comment);
  evt.stopPropagation();
};
IndexView.prototype.onClickCancel = function(evt) {
  this.cancelEdits();
  evt.stopPropagation();
};
IndexView.prototype.onClickSave = function(evt) {
  var $comments = this.getTextareas();
  this.saveComments($comments);
  evt.stopPropagation();
};
IndexView.prototype.editComments = function() {
  var $spans = this.el.find('span.comment, span.comment-edit');
  var $textareas = this.getTextareas();
  var $actionButtons = this.getActionButtons();
  var $actionEditAll = this.getActionEditAll();

  $spans.hide();
  $actionEditAll.hide();
  $textareas.show();
  $actionButtons.show();
};
IndexView.prototype.editComment = function($comment) {
  var $spans = $comment.find('span.comment, span.comment-edit');
  var $textarea = this.getTextareas($comment);
  var $actionButtons = this.getActionButtons();
  $spans.hide();
  $textarea.show();
  $actionButtons.show();
};
IndexView.prototype.saveComments = function($textareas) {
  $textareas.each(this.processComment);
  this.alignments.triggerChange();
  this.render();
};
IndexView.prototype.cancelEdits = function() {
  this.render();
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
    maxBuckets: maxBuckets
  });
  this.el.html(html);
  return this;
};

module.exports = IndexView;

