var $ = require('jquery');
var templates = require('../../templates.js');

var ExportView = function(options) {
  this.dismiss = options.dismiss;
  this.importExport = options.importExport;
  this.render = this.render.bind(this);
  this.import = this.import.bind(this);
  this.title = "Export";
  this.canPopout = false;
  this.init();
};

ExportView.prototype.init = function() {
  this.el = $("<div/>");
  this.el.on('click', '.wordmapper-import', null, this.import);
};

ExportView.prototype.render = function() {
  var template = templates.export;
  var html = template({
    importExport: this.importExport
  });
  this.el.html(html);
  return this;
};

ExportView.prototype.import = function(evt) {
  var textarea = this.el.find('textarea[name="import"]');
  var jsonData = textarea.val();
  console.log("import data", jsonData);
  var result = this.importExport.import(jsonData);
  console.log("import result", result);
  var $el = this.el.find('.wordmapper-import-messages');
  if (result.success) {
    $el.html('<span class="success">Import completed successfully</span>');
    window.setTimeout(this.dismiss, 500);
  } else {
    $el.html('<span class="error">' + result.message + '</span>');
  }
};

module.exports = ExportView;

