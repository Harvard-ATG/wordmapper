var $ = require('jquery');
var logging = require('logging');
var events = require('../events.js');
var models = require('../models.js');

var TextComponent = function(options) {
  this.selector = options.selector;
  this.alignments = options.alignments;
  this.sources = options.sources;
  this.textBoxes = null;
  this.bindMethods.forEach(function(method) {
    this[method] = this[method].bind(this);
  }, this);
  this.init();
};
TextComponent.prototype.bindMethods = [
  'onClickWord',
  'onMouseoverWord',
  'onMouseoutWord',
  'updateAlignments',
  'deleteAlignments',
  'clearHighlighted',
  'align'
];
TextComponent.prototype.init = function() {
  this.sources.addSources(this.loadSources());
  this.transform();
  this.textBoxes = this.select();
  this.addListeners();
};
TextComponent.prototype.addListeners = function() {
  this.textBoxes.on('click', '.wordmapper-word', null, this.onClickWord);
  this.textBoxes.on('mouseover', '.wordmapper-word', null, this.onMouseoverWord);
  this.textBoxes.on('mouseout', '.wordmapper-word', null, this.onMouseoutWord);
  this.alignments.on('change', this.updateAlignments);
  this.alignments.on('load', this.updateAlignments);
  this.alignments.on('reset', this.updateAlignments);
  events.hub.on(events.EVT.CLEAR_HIGHLIGHTS, this.clearHighlighted);
  events.hub.on(events.EVT.DELETE_ALIGNMENTS, this.deleteAlignments);
  events.hub.on(events.EVT.ALIGN, this.align);
};
TextComponent.prototype.onClickWord = function(evt) {
  //loggin.log("click", evt.target);
  this.toggleHighlight(evt.target);
};
TextComponent.prototype.onMouseoverWord = function(evt) {
  //loggin.log("mouseover", evt.target);
  var spans = this.selectAlignedWith(evt.target);
  if (spans.length > 0) {
    this.addHighlight2(spans);
  }
};
TextComponent.prototype.onMouseoutWord = function(evt) {
  //logging.log("mouseout", evt.target);
  this.clearHighlight2();
};
TextComponent.prototype.align = function() {
  var spans = this.selectHighlighted();
  if (spans.length > 0) {
    var words = models.Source.createWords(spans.toArray(), this.sources);
    var alignment = this.alignments.createAlignment(words);
    this.alignments.add(alignment);
  }
  this.clearHighlighted();
};
TextComponent.prototype.updateAlignments = function() {
  var _this = this;

  this.selectAlignments().each(function(index, el) {
    delete el.dataset.alignment;
    _this.removeAligned(el);
  });

  this.alignments.forEach(function(alignment, index) {
    var spans = _this.selectWords(alignment.words);
    $(spans).each(function(index, el) {
      el.dataset.alignment = alignment.id;
    });
    _this.addAligned(spans);
  });
};
TextComponent.prototype.deleteAlignments = function() {
  var highlighted = this.selectHighlighted();
  var aligned = $(highlighted).filter('[data-alignment]');

  // Delete *all* alignments when nothing is highlighted, otherwise
  // delete any aligned words that are highlighted.
  if (highlighted.length === 0) {
    this.alignments.reset();
  } else if(aligned.length > 0) {
    $(aligned).each(function(idx, span) {
      this.alignments.removeWord(span.dataset.alignment, this.sources.createWord(span));
    }.bind(this));
    this.alignments.removeEmpty();
    this.alignments.triggerChange();
  }
  this.clearHighlighted();
};
TextComponent.prototype.addAligned = function(spans) {
  return $(spans).addClass("aligned");
};
TextComponent.prototype.toggleHighlight = function(spans) {
  var has_highlight = $(spans).hasClass('highlight');
  var action = (has_highlight ? 'removeHighlight' : 'addHighlight');
  this[action](spans);
};
TextComponent.prototype.addHighlight = function(spans) {
  return $(spans).addClass("highlight");
};
TextComponent.prototype.removeHighlight = function(spans) {
  return $(spans).removeClass("highlight");
};
TextComponent.prototype.addHighlight2 = function(spans) {
  return $(spans).addClass('highlight2');
};
TextComponent.prototype.clearHighlight2 = function() {
  return this.textBoxes.find('.highlight2').removeClass('highlight2');
};
TextComponent.prototype.clearHighlighted = function() {
  return this.selectHighlighted().removeClass('highlight');
};
TextComponent.prototype.clearAligned = function() {
  return this.textBoxes.find('.aligned').removeClass('aligned');
};
TextComponent.prototype.removeAligned = function(spans) {
  return $(spans).removeClass("aligned");
};
TextComponent.prototype.selectHighlighted = function() {
  return this.textBoxes.find('.highlight');
};
TextComponent.prototype.selectAlignedWith = function(el) {
  return this.selectAlignment(el.dataset.alignment);
};
TextComponent.prototype.selectAlignment = function(alignment_id) {
  return this.textBoxes.find('[data-alignment="'+alignment_id+'"]');
};
TextComponent.prototype.selectAlignments = function() {
  return this.textBoxes.find('[data-alignment]');
};
TextComponent.prototype.selectWord = function(word) {
  return this.textBoxes.find('[data-word="'+word.index+'"][data-source="'+word.source.index+'"]');
};
TextComponent.prototype.selectWords = function(words) {
  var selector = words.map(function(word) {
    return '[data-word="'+word.index+'"][data-source="'+word.source.index+'"]';
  }).join(", ");
  return this.textBoxes.find(selector);
};
TextComponent.prototype.loadSources = function() {
  return this.select().toArray().map(this.createSource);
};
TextComponent.prototype.createSource = function(el, index) {
  return new models.Source.fromDOM(el, index);
};
TextComponent.prototype.select = function() {
  return $(this.selector);
};
TextComponent.prototype.transform = function() {
  var textBoxes = this.select();
  this.sources.forEach(function(source, index) {
    this.replace(textBoxes[index], source.transform().copyElement());
  }, this);
};
TextComponent.prototype.replace = function(textBox, el) {
  textBox.parentNode.replaceChild(el, textBox);
};

module.exports = TextComponent;