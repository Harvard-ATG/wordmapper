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
  this.nextWordId = (function() {
    var id = 0;
    return function() {
      return ++id;
    };
  })();
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
    if (!_this.isWordified(el)) {
      _this.convertTextNodes(el);
    }
  });
};
SourceTexts.prototype.isWordified = function(el) {
  return $(el).find('.wordmapper-word').length > 0;
};
SourceTexts.prototype.convertTextNodes = function(root) {
  var traverse = function traverse(node, callback) {
    var children = Array.prototype.slice.call(node.childNodes);
    for(var i = 0; i < children.length; i++) {
      traverse(children[i], callback);
    }
    if (node.nodeType == 3) {
      callback(node);
    }
  };
  traverse(root, this.convertText.bind(this));
};
SourceTexts.prototype.convertText = function(textNode) {
  var spans = this.textToWords(textNode.nodeValue).map(function(word) {
    return this.makeSpan(word, this.nextWordId());
  }, this);

  var span = spans.reduce(function(parentSpan, currentSpan, index) {
    parentSpan.appendChild(currentSpan);
    parentSpan.appendChild(document.createTextNode(" "));
    return parentSpan;
  }, document.createElement("span"));

  textNode.parentNode.replaceChild(span, textNode);
};
SourceTexts.prototype.textToWords = function(content) {
  return content.split(/\s+/).filter(function(word) {
    return word.length > 0;
  });
};
SourceTexts.prototype.makeSpan = function(word, id) {
  var span = document.createElement('span');
  span.className = 'wordmapper-word';
  span.id = "wordmapper-word-" + id;
  span.innerHTML = word;
  return span;
};


//---------------------------------------------------------------------
module.exports = {
    Application: Application,
    Panel: Panel
};