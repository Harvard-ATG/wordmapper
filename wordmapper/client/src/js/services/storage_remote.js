var $ = require('jquery');
var _ = require('lodash');
var parser = require('./parser.js');

var AlignmentsParser = parser.AlignmentsParser;

var StorageRemote = function(parent, options) {
  options = options || {};
  this.parent = parent;
  this._enabled = options.enabled || false;
};
StorageRemote.prototype.enabled = function() {
  return this._enabled;
};
StorageRemote.prototype.enable = function() {
  this._enabled = true;
};
StorageRemote.prototype.disable = function() {
  this._enabled = false;
};
StorageRemote.prototype.loadAlignments = function() {
  console.log("StorageRemote loadAlignments");
  var _this = this;
  var url = this._url("/alignments");
  var hashes = this.parent.models.sources.getHashes();
  var promise = this._ajax({
    method: "GET",
    url: url,
    data: {sources: hashes.join(",")}
  });
  var deferred = $.Deferred();

  promise.done(function(responseData, textStatus, jqXHR) {
    try {
      var alignment_objects = _this._parseAlignments(responseData.data);
      deferred.resolve(alignment_objects);
    } catch (e) {
      deferred.fail(e);
    }
  }).fail(function() {
    deferred.fail.apply(deferred, arguments);
  });

  return deferred.promise();
};
StorageRemote.prototype.saveAlignments = function() {
  console.log("StorageRemote saveAlignments");
  var url = this._url("/alignments");
  var serialized = this.parent.models.alignments.serialize();
  var promise = this._ajax({
    method: "POST",
    url: url,
    processData: false,
    data: serialized
  });
  return promise;
};
StorageRemote.prototype.loadSources = function() {
  console.log("StorageRemote loadSources");
  var url = this._url("/sources");
  var hashes = this.parent.models.sources.getHashes();
  return this._ajax({
    method: "GET",
    url: url,
    data: {hashes: hashes.join(",")}
  });
};
StorageRemote.prototype.saveSources = function() {
  console.log("StorageRemote saveSources");
  var url = this._url("/sources");
  var serialized = this.parent.models.sources.serialize();
  var promise = this._ajax({
    method: "POST",
    url: url,
    processData: false,
    data: serialized
  });
  var deferred = $.Deferred();

  promise.done(function(data, textStatus, jqXHR) {
    deferred.resolve(data);
  }).fail(function() {
    deferred.fail.apply(deferred, arguments);
  });

  return deferred.promise();
};
StorageRemote.prototype._url = function(path) {
  return this.parent.settings.getAPIBaseUrl() + path;
};
StorageRemote.prototype._ajax = function(options) {
  var user = this.parent.models.user;
  var defaults = {
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    beforeSend: function(jqXHR, settings) {
      jqXHR.setRequestHeader('Authorization', 'JWT ' + user.getToken());
    }
  };
  var ajaxOptions = _.assign({}, options, defaults);
  return $.ajax(ajaxOptions);
};
StorageRemote.prototype._parseAlignments = function(data) {
  var parser = new AlignmentsParser(data, this.parent.models.sources);
  parser.parse();
  return parser.output;
};

module.exports = StorageRemote;