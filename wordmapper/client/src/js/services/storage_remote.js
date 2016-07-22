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

  return new Promise(function(resolve, reject) {
    promise.then(function(responseData) {
      try {
        resolve(_this._parseAlignments(responseData.data));
      } catch (e) {
        reject(e);
      }
    }, reject);
  });
};
StorageRemote.prototype.saveAlignments = function() {
  console.log("StorageRemote saveAlignments");
  var url = this._url("/alignments");
  var serialized = this.parent.models.alignments.serialize();
  return this._ajax({
    method: "POST",
    url: url,
    processData: false,
    data: serialized
  });
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
  return this._ajax({
    method: "POST",
    url: url,
    processData: false,
    data: serialized
  });
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
  var result = $.ajax(ajaxOptions);

  return new Promise(function(resolve, reject) {
    result.done(function(responseData, textStatus, jqXHR) {
      resolve(responseData);
    }).fail(function(jqXHR, textStatus, errorThrown) {
      if (jqXHR && jqXHR.responseJSON && jqXHR.responseJSON.hasOwnProperty("message")) {
        console.error(jqXHR.responseJSON);
        reject(jqXHR.responseJSON.message + ' ('+errorThrown+')');
      } else {
        reject(errorThrown);
      }
    });
  });
};
StorageRemote.prototype._parseAlignments = function(data) {
  var parser = new AlignmentsParser(data, this.parent.models.sources);
  parser.parse();
  return parser.output;
};

module.exports = StorageRemote;