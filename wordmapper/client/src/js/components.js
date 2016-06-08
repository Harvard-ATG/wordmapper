var events = require('./events.js');
var services = require('./services.js');
var templates = require('./templates.js');

//---------------------------------------------------------------------
var Application = function() {
  this.init();
};
Application.prototype.init = function() {
  var panel = new Panel();
  panel.render();
  var sourceTexts = new SourceTexts();
};

//---------------------------------------------------------------------
var Panel = function() {
  this.el = null;
  this.init();
};
Panel.prototype.init = function() {
  this.el = $('<div>').appendTo("body");
  this.onClickButton = this.onClickButton.bind(this);
  this.addListeners();
};
Panel.prototype.addListeners = function() {
  this.el.on('click', this.onClickButton);
};
Panel.prototype.onClickButton = function(evt) {
  var btnMap = {
    align: 'ALIGN',
    clear_highlights: 'CLEAR_HIGHLIGHTS',
    build_index: 'BUILD_INDEX'
  };
  var t = evt.target;
  if (t.nodeName == 'BUTTON' && t.name in btnMap) {
    events.hub.trigger(btnMap[t.name]);
  }  
};
Panel.prototype.render = function() {
  this.el.html(templates.panel());
};

//---------------------------------------------------------------------
var SourceTexts = function() {
  this.init();
};
SourceTexts.prototype.init = function() {
  this.onClickWord = this.onClickWord.bind(this);
  this.onHoverWord = this.onHoverWord.bind(this);
  this.textBoxes = this.selectTextBoxes();
  this.wordify();
  this.addListeners();
};
SourceTexts.prototype.addListeners = function() {
  
};
SourceTexts.prototype.onClickWord = function(evt) {
  
};
SourceTexts.prototype.onHoverWord = function(evt) {
  
};
SourceTexts.prototype.selectTextBoxes = function() {
  return $(".textboxcontent");
};
SourceTexts.prototype.wordify = function() {
  console.log("wordify");
  var _this = this;
  this.textBoxes.each(function(i, el) {
    console.log(i, el);
    if (!_this.isWordified(el)) {
      _this.setupWords(el);
    }
  });
};
SourceTexts.prototype.isWordified = function(el) {
  return $(el).find('.wordmapper-word').length > 0;
};
SourceTexts.prototype.setupWords = function(el) {
  console.log("setupWords");
  var node = el;
  var content, words, spans;
  while (node) {
    if (node.nodeType == 1) {
      if (node.firstChild) {
        node = node.firstChild;
      } else if (node.nextSibling) {
        node = node.nextSibling;
      } else {
        node = node.parentNode.nextSibling;
      }
      console.log("node: ", node.nodeType, node);
    } else if (node.nodeType == 3) {
      content = node.nodeValue;
      words = content.split(/\s+/).filter(function(word) {
        return word.length > 0;
      });
      console.log(words);
      if (node.nextSibling) {
        node = node.nextSibling;
      } else {
        node = node.parentNode.nextSibling;
      }
    }
  }
};

//---------------------------------------------------------------------
module.exports = {
    Application: Application,
    Panel: Panel
};