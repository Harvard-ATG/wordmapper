var $ = require('jquery');
var events = require('../events.js');
var models = require('../models.js');

var TextBoxes = function(options) {
  this.selector = options.selector;
  this.alignments = options.alignments;
  this.sources = null;
  this.textBoxes = null;
  this.bindMethods.forEach(function(method) {
    this[method] = this[method].bind(this);
  }, this);
  this.init();
};
TextBoxes.prototype.bindMethods = [
  'onClickWord',
  'onMouseoverWord',
  'onMouseoutWord',
  'updateAlignments',
  'resetAlignments',
  'clearHighlighted',
  'align'
];
TextBoxes.prototype.init = function() {
  this.sources = this.loadSources();
  this.transform();
  this.textBoxes = this.select();
  this.addListeners();
};
TextBoxes.prototype.addListeners = function() {
  this.textBoxes.on('click', '.wordmapper-word', null, this.onClickWord);
  this.textBoxes.on('mouseover', '.wordmapper-word', null, this.onMouseoverWord);
  this.textBoxes.on('mouseout', '.wordmapper-word', null, this.onMouseoutWord);
  this.alignments.on('change', this.updateAlignments);
  events.hub.on(events.EVT.CLEAR_HIGHLIGHTS, this.clearHighlighted);
  events.hub.on(events.EVT.CLEAR_ALIGNMENTS, this.resetAlignments);
  events.hub.on(events.EVT.ALIGN, this.align);
};
TextBoxes.prototype.onClickWord = function(evt) {
  //console.log("click", evt.target);
  this.toggleHighlight(evt.target);
};
TextBoxes.prototype.onMouseoverWord = function(evt) {
  //console.log("mouseover", evt.target);
  var spans = this.selectAlignedWith(evt.target);
  if (spans.length > 0) {
    this.addHighlight2(spans);
  }
};
TextBoxes.prototype.onMouseoutWord = function(evt) {
  //console.log("mouseout", evt.target);
  this.clearHighlight2();
};
TextBoxes.prototype.align = function() {
  var spans = this.selectHighlighted();
  if (spans.length > 0) {
    var words = models.Source.createWords(spans.toArray(), this.sources);
    var alignment = this.alignments.createAlignment(words);
    this.alignments.add(alignment);
  }
  this.clearHighlighted();
};
TextBoxes.prototype.updateAlignments = function() {
  var _this = this;
  var alignments = this.alignments.alignments;

  this.selectAlignments().each(function(index, el) {
    delete el.dataset.alignment;
    _this.removeAligned(el);
  });

  alignments.forEach(function(alignment, index) {
    var spans = _this.selectWords(alignment.words);
    $(spans).each(function(index, el) {
      el.dataset.alignment = alignment.id;
    });
    _this.addAligned(spans);
  });
};
TextBoxes.prototype.resetAlignments = function() {
  this.alignments.reset();
};
TextBoxes.prototype.addAligned = function(spans) {
  return $(spans).addClass("aligned");
};
TextBoxes.prototype.toggleHighlight = function(spans) {
  var has_highlight = $(spans).hasClass('highlight');
  var action = (has_highlight ? 'removeHighlight' : 'addHighlight');
  this[action](spans);
};
TextBoxes.prototype.addHighlight = function(spans) {
  return $(spans).addClass("highlight");
};
TextBoxes.prototype.removeHighlight = function(spans) {
  return $(spans).removeClass("highlight");
};
TextBoxes.prototype.addHighlight2 = function(spans) {
  return $(spans).addClass('highlight2');
};
TextBoxes.prototype.clearHighlight2 = function() {
  return this.textBoxes.find('.highlight2').removeClass('highlight2');
};
TextBoxes.prototype.clearHighlighted = function() {
  return this.selectHighlighted().removeClass('highlight');
};
TextBoxes.prototype.clearAligned = function() {
  return this.textBoxes.find('.aligned').removeClass('aligned');
};
TextBoxes.prototype.removeAligned = function(spans) {
  return $(spans).removeClass("aligned");
};
TextBoxes.prototype.selectHighlighted = function() {
  return this.textBoxes.find('.highlight');
};
TextBoxes.prototype.selectAlignedWith = function(el) {
  return this.selectAlignment(el.dataset.alignment);
};
TextBoxes.prototype.selectAlignment = function(alignment_id) {
  return this.textBoxes.find('[data-alignment="'+alignment_id+'"]');
};
TextBoxes.prototype.selectAlignments = function() {
  return this.textBoxes.find('[data-alignment]');
};
TextBoxes.prototype.selectWord = function(word) {
  return this.textBoxes.find('[data-word="'+word.index+'"][data-source="'+word.source.index+'"]');
};
TextBoxes.prototype.selectWords = function(words) {
  var selector = words.map(function(word) {
    return '[data-word="'+word.index+'"][data-source="'+word.source.index+'"]';
  }).join(", ");
  return this.textBoxes.find(selector);
};
TextBoxes.prototype.loadSources = function() {
  return this.select().toArray().map(this.createSource);
};
TextBoxes.prototype.createSource = function(el, index) {
  return new models.Source.fromDOM(el, index);
};
TextBoxes.prototype.select = function() {
  return $(this.selector);
};
TextBoxes.prototype.transform = function() {
  var textBoxes = this.select();
  this.sources.forEach(function(source, index) {
    this.replace(textBoxes[index], source.transform().copyElement());
  }, this);
};
TextBoxes.prototype.replace = function(textBox, el) {
  textBox.parentNode.replaceChild(el, textBox);
};

module.exports = TextBoxes;