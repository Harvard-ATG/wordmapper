var events = require('./events.js');
var services = require('./services.js');
var models = require('./models.js');
var templates = require('./templates.js');

var EVT = {
  ALIGN: 'align',
  CLEAR_HIGHLIGHTS: 'clear_highlights',
  CLEAR_ALIGNMENTS: 'clear_alignments',
  BUILD_INDEX: 'build_index',
  EXPORT: 'export'
};

//---------------------------------------------------------------------
var Application = function() {
  this.init();
};
Application.prototype.init = function() {
  this.el = $('<div>').appendTo('body');
  this.panel = new Panel();
  this.alignments = new models.Alignments();
  this.boxes = new TextBoxes({
    alignments: this.alignments,
    selector: '.textboxcontent'
  });
  this.overlay = new Overlay({
    alignments: this.alignments
  });
};
Application.prototype.render = function() {
  this.el.append(this.panel.render().el);
  this.el.append(this.overlay.render().el);
  return this;
};

//---------------------------------------------------------------------
var Overlay = function(options) {
  this.alignments = options.alignments;
  this.lastRenderer = null;
  this.hiddenCls = 'wordmapper-overlay-hidden';
  this.init();
};
Overlay.prototype.init = function() {
  this.el = $("<div>").append('<div class="'+this.hiddenCls+'"></div>');
  this.addListeners();
};
Overlay.prototype.addListeners = function() {
  events.hub.on(EVT.BUILD_INDEX, this.makeRenderer("index"));
  events.hub.on(EVT.EXPORT, this.makeRenderer("export"));
};
Overlay.prototype.visible = function() {
  return this.el.andSelf().find('.' + this.hiddenCls).length === 0;
};
Overlay.prototype.render = function() {
  return this;
};
Overlay.prototype.makeRenderer = function(name) {
  return function() {
    var template = templates[name];
    this.el.html(template({
      cls: this.getCls(name),
      alignments: this.alignments
    }));
    this.lastRenderer = name;
    return this;
  }.bind(this);
};
Overlay.prototype.getCls = function(renderer) {
  var cls = '';
  if (this.visible()) {
    if (renderer === this.lastRenderer) {
      cls = this.hiddenCls;
    }
  }
  return cls;
};

//---------------------------------------------------------------------
var Panel = function() {
  this.el = null;
  this.onClickButton = this.onClickButton.bind(this);
  this.init();
};
Panel.prototype.init = function() {
  this.el = $('<div>');
  this.addListeners();
};
Panel.prototype.addListeners = function() {
  this.el.on('click', this.onClickButton);
};
Panel.prototype.onClickButton = function(evt) {
  var btnMap = {
    align: EVT.ALIGN,
    clear_highlights: EVT.CLEAR_HIGHLIGHTS,
    clear_alignments: EVT.CLEAR_ALIGNMENTS,
    build_index: EVT.BUILD_INDEX,
    export: EVT.EXPORT
  };
  var t = evt.target;
  if (t.nodeName == 'BUTTON' && t.name in btnMap) {
    events.hub.trigger(btnMap[t.name]);
  }  
};
Panel.prototype.render = function() {
  this.el.html(templates.panel());
  return this;
};

//---------------------------------------------------------------------
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
  'onAlignmentsAdd',
  'clearHighlights',
  'align'
];
TextBoxes.prototype.init = function() {
  this.loadSources();
  this.transform();
  this.textBoxes = this.select();
  this.addListeners();
};
TextBoxes.prototype.addListeners = function() {
  this.textBoxes.on('click', '.wordmapper-word', null, this.onClickWord);
  this.textBoxes.on('mouseover', '.wordmapper-word', null, this.onMouseoverWord);
  this.textBoxes.on('mouseout', '.wordmapper-word', null, this.onMouseoutWord);
  this.alignments.on('add', this.onAlignmentsAdd);
  events.hub.on(EVT.CLEAR_HIGHLIGHTS, this.clearHighlights);
  events.hub.on(EVT.ALIGN, this.align);
};
TextBoxes.prototype.onClickWord = function(evt) {
  //console.log("click", evt.target);
  this.showHighlight(evt.target);
};
TextBoxes.prototype.onMouseoverWord = function(evt) {
  //console.log("mouseover", evt.target);
  var spans = this.selectAlignedWith(evt.target);
  if (spans.length > 0) {
    this.showAlignmentHighlight(spans);
  }
};
TextBoxes.prototype.onMouseoutWord = function(evt) {
  //console.log("mouseout", evt.target);
  this.clearAlignmentHighlight();
};
TextBoxes.prototype.onAlignmentsAdd = function(alignment) {
  var spans = this.selectWords(alignment.words);
  this.setAlignedTo(spans, alignment);
  this.showAligned(spans);
};
TextBoxes.prototype.align = function() {
  var spans = this.selectHighlighted();
  if (spans.length > 0) {
    var words = models.Source.createWords(spans.toArray(), this.sources);
    var alignment = this.alignments.createAlignment(words);
    this.alignments.add(alignment);
  }
  this.clearHighlights();
};
TextBoxes.prototype.showAligned = function(spans) {
  return $(spans).addClass("aligned");
};
TextBoxes.prototype.clearAligned = function() {
  this.textBoxes.find('.aligned').removeClass('aligned');
};
TextBoxes.prototype.setAlignedTo = function(spans, alignment) {
  $(spans).each(function(index, el) {
    el.dataset.alignment = alignment.id;
  });
};
TextBoxes.prototype.showAlignmentHighlight = function(spans) {
  $(spans).addClass('highlight2');
};
TextBoxes.prototype.clearAlignmentHighlight = function() {
  this.textBoxes.find('.highlight2').removeClass('highlight2');
};
TextBoxes.prototype.selectAlignedWith = function(el) {
  var alignment_id = el.dataset.alignment;
  return this.selectAlignment(alignment_id);
};
TextBoxes.prototype.selectAlignment = function(alignment_id) {
  var selector = '[data-alignment="'+alignment_id+'"]';
  return this.textBoxes.find(selector);
};
TextBoxes.prototype.selectWord = function(word) {
  var selector = '[data-word="'+word.index+'"][data-source="'+word.source.index+'"]';
  return this.textBoxes.find(selector);
};
TextBoxes.prototype.selectWords = function(words) {
  var selectors = words.map(function(word) {
    return '[data-word="'+word.index+'"][data-source="'+word.source.index+'"]';
  });
  return this.textBoxes.find(selectors.join(", "));
};
TextBoxes.prototype.showHighlight = function(el) {
  $(el).addClass("highlight");
};
TextBoxes.prototype.selectHighlighted = function() {
  return this.textBoxes.find('.highlight');
};
TextBoxes.prototype.clearHighlights = function() {
  this.selectHighlighted().removeClass('highlight');
};
TextBoxes.prototype.loadSources = function() {
  this.sources = this.select().toArray().map(this.createSource);
};
TextBoxes.prototype.createSource = function(el) {
  return new models.Source.fromDOM(el);
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


//---------------------------------------------------------------------
module.exports = {
    Application: Application,
    Panel: Panel
};