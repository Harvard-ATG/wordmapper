var _ = require('lodash');

/**
 * Parser.
 *
 * Takes external input in an expected format, validates it and parses it into
 * a format more convenient for the application to work with.
 */
var Parser = function(data) {
  this.input = data;
  this.parsed = false;
  this.valid = false;
  this.errors = [];
};
Parser.prototype.asPromise = function() {
  var parser = this;
  return new Promise(function(resolve, reject) {
    parser.parse();
    if (!parser.valid) {
      reject({message: "Error parsing data", errors: parser.errors});
    }
    resolve(parser);
  });
};
Parser.prototype.parse = function() {
	this.valid = false;
	this.parsed = false;
  this._validate();
  this._parse();
  return this;
};
Parser.prototype.error = function(msg) {
  this.errors.push(msg);
  return this;
};
Parser.prototype._validateTopLevel = function(inputType) {
	var valid = true;
  if (typeof this.input !== "object") {
		valid = false;
    this.error("Data must be of type 'object'");
  }
  if (!this.input.type || !this.input.data) {
		valid = false;
    this.error("Top-level object missing 'type' or 'data' attribute");
  }
  if (this.input.type !== inputType) {
		valid = false;
    this.error("Top-level object 'type' attribute must equal '"+inputType+"'");
  }
  if (!Array.isArray(this.input.data)) {
		valid = false;
    this.error("Top-level object 'data' attribute must be an array");
  }
	return valid;
};

/**
 * AlignmentsParser
 */
var AlignmentsParser = function(data) {
	Parser.call(this, data);
  this.alignments = [];
};
_.assign(AlignmentsParser.prototype, Parser.prototype);

AlignmentsParser.prototype._validate = function() {
	if(!this._validateTopLevel("alignments")) {
		return this;
	}

  // check each alignment
  for(var i = 0, alignments = this.input.data, alignment, errAlignment; i < alignments.length; i++) {
    alignment = alignments[i];
    errAlignment = 'Alignment['+i+'] ';
    if (!alignment.type || !alignment.data) {
      return this.error(errAlignment + " missing 'type' or 'data' attribute");
    }
    if (alignment.type !== "alignment") {
      return this.error(errAlignment + " incorrect object 'type': must be 'alignment'");
    }
    if (!Array.isArray(alignment.data)) {
      return this.error(errAlignment + " incorrect object 'data' attribute: must be an array");
    }

    // check each item
    for(var j = 0, items = alignment.data, item, errItem; j < items.length; j++) {
      item = items[j];
      errItem = errAlignment + ' Item['+j+']';
      if (!item.type || !item.data) {
        return this.error(errItem + " missing 'type' or 'data' attribute");
      }
      if (item.type === "word") {
        if (!item.data.hasOwnProperty("index")
          || !item.data.hasOwnProperty("source")
          ||  !item.data.hasOwnProperty("value")) {
          return this.error(errItem + " missing valid 'data' attributes index, source, value");
        }
      } else if (item.type === "comment") {
        if (!item.data.hasOwnProperty("text")) {
          return this.error(errItem + " missing valid 'data' attribute 'text'");
        }
      } else {
        return this.error(errItem + " invalid type");
      }
    }
  }

  this.valid = true;
  return this;
};
AlignmentsParser.prototype._parse = function() {
  if (!this.valid) {
    return this;
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
    var comment = comments.join(" ").trim(); // coalesce multiple comments, since we only support *one* comment at this time
    return {
      comment: comment,
      words: words
    };
  });

	this.source_hashes = Object.keys(this.alignments.reduce(function(dict, alignment) {
		alignment.words.forEach(function(word) {
			dict[word.source] = true;
		});
		return dict;
	}, {}));
  
  this.parsed = true;
	return this;
};


/**
 * SourcesParser
 */
var SourcesParser = function(data) {
	Parser.call(this, data);
	this.sources = [];
};
_.assign(SourcesParser.prototype, Parser.prototype);

SourcesParser.prototype._validate = function() {
	if(!this._validateTopLevel("sources")) {
		return this;
	}

  // check each source
  for(var i = 0, sources = this.input.data, source, errAerrSourcelignment; i < sources.length; i++) {
    source = sources[i];
    errSource = 'Source['+i+'] ';
    if (!source.type || !source.data) {
      return this.error(errSource + " missing 'type' or 'data' attribute");
    }
    if (source.type !== "source") {
      return this.error(errSource + " incorrect object 'type': must be 'alignment'");
    }
    if (!(typeof source.data == "object" && !Array.isArray(source.data))) {
      return this.error(errSource + " incorrect object 'data' attribute: must be a plain object");
    }
		
		for (var j = 0, attrs = ['hash','normalized','original']; j < attrs.length; j++) {
			if (!source.data.hasOwnProperty(attrs[j])) {
				return this.error(errSource + " missing '"+attrs[j]+"' attribute");
			}
		}
	}

	this.valid = true;
	return this;
};
SourcesParser.prototype._parse = function() {
  if (!this.valid) {
    return this;
  }

  this.sources = this.input.data.map(function(source) {
		return source.data;
	});
	
	this.source_hashes = this.input.data.map(function(source) {
		return source.data.hash;
	});

	this.parsed = true;
	return this;
};


module.exports.AlignmentsParser = AlignmentsParser;
module.exports.SourcesParser = SourcesParser;