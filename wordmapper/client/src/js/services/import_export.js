var models = require('../models.js');

var ImportExportService = function(options) {
  this.sources = options.sources;
  this.alignments = options.alignments;
  this.siteContext = options.siteContext;
  this.import = this.import.bind(this);
  this.export = this.export.bind(this);
};
ImportExportService.prototype.import = function(jsonData) {
  var sourceMap = this.sources.getSourceHashMap();
  var retvalue = {"success": true, "message": ""};

  try {
    var result = JSON.parse(jsonData);
    
    // Preliminary error checking
    if (result.type != "site" || !result.hasOwnProperty("data")) { 
      throw "Invalid import data. Top-level object must be of type 'site' with a 'data' attribute.";
    } else if(result.data.type != "alignments" || !result.data.hasOwnProperty("data")) {
      throw "Invalid import data. Object contained by 'site' must be of type 'alignments' with a 'data' attribute.";
    }

    // Attempt to create an array of alignment objects, each of which contains an array of word objects
    var batch = result.data.data.map(function(alignment, alignmentIdx) {
      if (!alignment.hasOwnProperty("data") || !Array.isArray(alignment.data)) {
        throw "Alignment item missing/invalid 'data'  attribute at: " + alignmentIdx;
      }
      var words = alignment.data.filter(function(item) {
        return item.type == "word";
      }).map(function(word, wordIdx) {
        var errpos = ["A", alignmentIdx, "W", wordIdx].join("");
        if (!word.hasOwnProperty("data")) {
          throw "Word item missing/invalid 'data' attribute at: " + errpos;
        }
        if (!sourceMap[word.data.source]) {
          throw "Word item (" + word.data.value + ") does not map to a valid source (" + word.data.source + ") at: " + errpos;
        }
        return models.Word.create({
          index: word.data.index,
          value: word.data.value,
          source: sourceMap[word.data.source]
        });
      });
      var comment_texts = alignment.data.filter(function(item) {
        return item.type == "comment";
      }).map(function(comment) {
        return comment.data.text;
      });
      var alignment_obj = models.Alignments.createAlignment(words);
      if (comment_texts.length > 0) {
        alignment_obj.setComment(comment_texts[0]);
      }
      return alignment_obj;
    });

    // Load the batch of alignment objects
    this.alignments.load(batch);

  } catch(e) {
    retvalue.success = false;
    retvalue.message = "An error occurred with the import. Error: " + e;
  }

  return retvalue;
};
ImportExportService.prototype.export = function(serialize) {
  var result = {
    'type': 'site',
    'id': this.siteContext.id,
    'url': this.siteContext.url,
    'data': this.alignments.toJSON()
  };
  return (serialize ? JSON.stringify(result, null, '\t') : result);
};

module.exports = ImportExportService;