var $ = require('jquery');
var models = require('./models.js');

//---------------------------------------------------------------------
var StorageService = function(options) {
  options = options || {};
  this.siteContext = options.siteContext || '';
  this.sources = options.sources || [];
};
StorageService.prototype.load = function() {
  var deferred = $.Deferred();
  this._load(deferred);
  return deferred;
};
StorageService.prototype.save = function(obj) {
  var deferred = $.Deferred();
  var serialized = this._serialize(obj);
  this._save(deferred, serialized);
  return deferred;
};
StorageService.prototype.getDataKey = function() {
  var sourceHashes = this.sources.map(function(source) {
    return source.hash;
  });
  sourceHashes.sort(function(a, b) {
    return (a == b ? 0 : (a < b ? -1 : 1));
  });
  return this.siteContext.id + "::" + sourceHashes.join(",");
};
StorageService.prototype.getSourceMap = function() {
  var dict = {};
  this.sources.forEach(function(source) {
    dict[source.hash] = source;
  });
  return dict;
};
StorageService.prototype._load = function() {
  throw "Subclass responsibility";
};
StorageService.prototype._save = function() {
  throw "Subclass responsibility";
};
StorageService.prototype._serialize = function(obj) {
  return obj.serialize();
};
StorageService.prototype._parse = function(jsonData) {
  var sourceMap = this.getSourceMap();
  var result = JSON.parse(jsonData);
  var alignments = result.data.map(function(alignment) {
    var words = alignment.data.filter(function(item) {
      return item.type == 'word';
    }).map(function(word) {
      return models.Word.create({
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
    var alignment_obj = models.Alignments.createAlignment(words);
    if (comment_texts.length > 0) {
      alignment_obj.setComment(comment_texts[0]);
    }
    return alignment_obj;
  });
  return alignments;
};

//---------------------------------------------------------------------
var LocalStorageService = function() {
  if (window.Storage === undefined) {
    throw "LocalStorage not supported in this browser.";
  }
  StorageService.apply(this, arguments);
};
LocalStorageService.prototype = new StorageService();
LocalStorageService.prototype._load = function(deferred) {
  var jsonData = localStorage.getItem(this.getDataKey());
  if (jsonData === null) {
    deferred.resolve([]);
  } else {
    deferred.resolve(this._parse(jsonData));
  }
};
LocalStorageService.prototype._save = function(deferred, serialized) {
  localStorage.setItem(this.getDataKey(), serialized);
  deferred.resolve();
};

//---------------------------------------------------------------------
var SettingsService = {
  // Settings are keyed by domain name
  // If a domain name has no associated settings, use some default/fallback settings.
  _settings: {
    '*': {
      'sourceSelector': 'body'
    },
    'www.graeco-arabic-studies.org': {
      'sourceSelector': '.textboxcontent'
    }
  },
  get: function(siteContext) {
    var settings = false;
    console.log("Loading settings for site ID: ", siteContext.id);
    if (siteContext.id in this._settings) {
      settings = this._settings[siteContext.id];
      console.log("Site ID exists. Settings: ", settings);
    } else {
      settings = this._settings['*'];
      console.log("No such site ID exists. Using default settings: ", settings);
    }
    
    return settings;
  }
};

var ImportExportService = function(options) {
  this.sources = options.sources || [];
  this.alignments = options.alignments;
  this.siteContext = options.siteContext;
  this.import = this.import.bind(this);
  this.export = this.export.bind(this);
};
ImportExportService.prototype.getSourceMap = function() {
  return this.sources.reduce(function(dict, source) {
    dict[source.hash] = source;
    return dict;
  }, {});
};
ImportExportService.prototype.import = function(jsonData) {
  var sourceMap = this.getSourceMap();
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

module.exports = {
  ImportExportService: ImportExportService,
  LocalStorageService: LocalStorageService,
  SettingsService: SettingsService
};