var Comment = function(options) {
  this.text = options.text || '';
};
Comment.prototype.getText = function() {
  return this.text;
};
Comment.prototype.toString = function() {
  return this.text;
};
Comment.prototype.toJSON = function() {
  return {
    'type': 'comment',
    'data': {
      'text': this.text
    }
  };
};
Comment.prototype.serialize = function() {
  return JSON.stringify(this.toJSON(), null, '\t');
};

module.exports = Comment;