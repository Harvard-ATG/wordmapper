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
  var boxes = new TextBoxes();
  boxes.setupWords();
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
    clear_alignments: 'CLEAR_ALIGNMENTS',
    build_index: 'BUILD_INDEX',
    export: 'EXPORT'
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
var TextBoxes = function() {
  this.init();
};
TextBoxes.prototype.init = function() {
  this.onClickWord = this.onClickWord.bind(this);
  this.onMouseoverWord = this.onMouseoverWord.bind(this);
  this.onMouseoutWord = this.onMouseoutWord.bind(this);
  this.clearHighlights = this.clearHighlights.bind(this);
  this.textBoxes = this.selectTextBoxes();
  this.wordId = 0;
  this.nextWordId = function() {
    return ++this.wordId;
  }.bind(this);
  this.addListeners();
};
TextBoxes.prototype.addListeners = function() {
  this.textBoxes.on('click', '.wordmapper-word', null, this.onClickWord);
  this.textBoxes.on('mouseover', '.wordmapper-word', null, this.onMouseoverWord);
  this.textBoxes.on('mouseout', '.wordmapper-word', null, this.onMouseoutWord);
  events.hub.on('CLEAR_HIGHLIGHTS', this.clearHighlights);
};
TextBoxes.prototype.onClickWord = function(evt) {
  //console.log("click", evt.target);
  $(evt.target).addClass("highlight");
};
TextBoxes.prototype.onMouseoverWord = function(evt) {
  //console.log("mouseover", evt.target);
};
TextBoxes.prototype.onMouseoutWord = function(evt) {
  //console.log("mouseout", evt.target);
};
TextBoxes.prototype.clearHighlights = function() {
  this.textBoxes.find('.wordmapper-word.highlight').removeClass('highlight');
};
TextBoxes.prototype.selectTextBoxes = function() {
  return $(".textboxcontent");
};
TextBoxes.prototype.setupWords = function() {
  this.textBoxes.each(this.convertTextNodes.bind(this));
};
TextBoxes.prototype.hasWords = function(el) {
  return $(el).find('.wordmapper-word').length > 0;
};
TextBoxes.prototype.convertTextNodes = function(index, el) {
  if (this.hasWords(el)) {
    return;
  }
  var sourceId = index+1;
  var traverse = function traverse(node, callback) {
    var children = Array.prototype.slice.call(node.childNodes);
    for(var i = 0; i < children.length; i++) {
      traverse(children[i], callback);
    }
    if (node.nodeType == 3) {
      callback(node, sourceId);
    }
  };
  this.wordId = 0;
  traverse(el, this.convertText.bind(this));
};
TextBoxes.prototype.convertText = function(textNode, sourceId) {
  var spans = this.textToWords(textNode.nodeValue).map(function(word) {
    return this.makeSpan(word, this.nextWordId(), sourceId);
  }, this);

  var span = spans.reduce(function(parentSpan, currentSpan, index) {
    parentSpan.appendChild(currentSpan);
    parentSpan.appendChild(document.createTextNode(" "));
    return parentSpan;
  }, document.createElement("span"));

  textNode.parentNode.replaceChild(span, textNode);
};
TextBoxes.prototype.textToWords = function(content) {
  return content.split(/\s+/).filter(function(word) {
    return word.length > 0;
  });
};
TextBoxes.prototype.makeSpan = function(word, wordId, sourceId) {
  var span = document.createElement('span');
  span.className = 'wordmapper-word';
  span.innerHTML = word;
  span.dataset.word = wordId;
  span.dataset.source = sourceId;
  return span;
};


//---------------------------------------------------------------------
module.exports = {
    Application: Application,
    Panel: Panel
};