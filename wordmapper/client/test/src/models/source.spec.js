var Source = require('../../../src/js/models/source.js');

describe("Source Model", function() {
  var HTML = [
    "  <p>One Two      Three</p><p>Four Five <span>Six</span> Seven</p> Eight, <div><span>Nine</span> Ten.</div>",
    " <p>Foo Bar</p>",
    " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce auctor ipsum nisi, eget porta mauris maximus at.",
    '<span class="wordmapper-word" data-word="0" data-source="0">Test</span> Foo Bar'
  ];
  var DIVS = HTML.map(function(html, index) {
    var divEl = document.createElement("div");
    divEl.className = "content content-"+index;
    divEl.innerHTML = html;
    return divEl;
  });

  it("should be created with an index and DOM element", function() {
    var index = 0;
    var el = DIVS[index].cloneNode(true);
    var source = new Source({ el: el, index: index });
    expect(source.el).toBe(el);
    expect(source.index).toBe(index);
    expect(source.normalizedText).toBeTruthy();
    expect(source.hash).toBeTruthy();
  });
  
  it("should test if there are any words in the HTML already", function() {
    var source1 = new Source({ el: DIVS[0].cloneNode(true), index: 0 });
    var source2 = new Source({ el: DIVS[3].cloneNode(true), index: 3 })
    expect(source1.containsSpans()).toBeFalsy();
    expect(source2.containsSpans()).toBeTruthy();
  });
});