var AlignmentsParser = function(data) {
  this.input = data;
  this.parsed = false;
  this.valid = false;
  this.errors = [];
  this.alignments = [];
};
AlignmentsParser.prototype.parse = function() {
  this._validate();
  this._parse();
  return this;
};
AlignmentsParser.prototype._error = function(msg) {
  throw msg;
  this.errors.push(msg);
  return this;
};
AlignmentsParser.prototype._validate = function() {
  this.valid = false;
  
  // check alignments
  if (typeof this.input !== "object") {
    return this._error("Data must be of type 'object'");
  }
  if (!this.input.type || !this.input.data) {
    return this._error("Missing top-level 'type' or 'data' attribute");
  }
  if (this.input.type !== "alignments") {
    return this._error("Incorrect top-level object 'type': must be 'alignments'");
  }
  if (!Array.isArray(this.input.data)) {
    return this._error("Incorrect 'alignments' object 'data' attribute: must be an array");
  }
  
  // check each alignment
  for(var i = 0, alignments = this.input.data, alignment; i < alignments.length; i++) {
    alignment = alignments[i];
    if (!alignment.type || !alignment.data) {
      return this._error("Alignment [" + i + "] missing 'type' or 'data' attribute");
    }
    if (alignment.type !== "alignment") {
      return this._error("Alignment [" + i + "] incorrect object 'type': must be 'alignment'");
    }
    if (!Array.isArray(alignment.data)) {
      return this._error("Alignment [" + i + "] incorrect object 'data' attribute: must be an array");
    }

    // check each item
    for(var j = 0, items = alignment.data, item; j < items.length; j++) {
      item = items[j];
      console.log("item", item, j);
      if (!item.type || !item.data) {
        return this._error("Alignment [" + i + "] Item [" + j + "] missing 'type' or 'data' attribute");
      }
      if (item.type === "word") {
        if (!item.data.hasOwnProperty("index")
          || !item.data.hasOwnProperty("source")
          ||  !item.data.hasOwnProperty("value")) {
          return this._error("Alignment [" + i + "] Word [" + j + "] missing valid 'data' attributes index, source, value");
        }
      } else if (item.type === "comment") {
        if (!item.data.hasOwnProperty("text")) {
          return this._error("Alignment [" + i + "] Comment [" + j + "] missing valid 'data' attribute 'text'");
        }
      } else {
        return this._error("Alignment [" + i + "] Item [" + j + "] invalid type");
      }
    }
  }

  this.valid = true;

  return this;
};
AlignmentsParser.prototype._parse = function() {
  if (!this.valid) {
    return;
  }
  var typeEquals = function(typeValue) {
    return function(item) {
      return item.type == typeValue;
    };
  };

  this.alignments = this.input.data.map(function(alignment) {
    var words = alignment.data.filter(typeEquals('word')).map(function(word) {
      return word.data;
    });
    var comments = alignment.data.filter(typeEquals('comment')).map(function(comment) {
      return comment.data.text;
    });
    var comment = comments.join(" "); // coalesce multiple comments, since we only support *one* comment at this time
    return {
      comment: comment,
      words: words
    };
  });
  
  this.parsed = true;
};

module.exports.AlignmentsParser = AlignmentsParser;