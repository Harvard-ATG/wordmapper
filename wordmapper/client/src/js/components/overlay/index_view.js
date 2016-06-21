var $ = require('jquery');
var templates = require('../../templates.js');

var IndexView = function(options) {
  this.alignments = options.alignments;
  this.render = this.render.bind(this);
  this.toggleComments = this.toggleComments.bind(this);
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
  this.el.on('click', 'button[name=action_comment]', null, this.toggleComments);
};
IndexView.prototype.toggleComments = function(evt) {
  var $textareas = this.el.find('textarea.comment');
  var $spans = this.el.find('span.comment');
  var $target = $(evt.target);
  var btn_text = $(evt.target).text();
  if ($target.text() == "Comment") {
    $target.text("Save Comments");
    $spans.hide();
    $textareas.show();
  } else {
    $target.text("Comment");
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
IndexView.prototype.render = function() {
  var template = templates.index;
  var html = template({
    alignments: this.alignments
  });
  this.el.html(html);
  return this;
};

module.exports = IndexView;

