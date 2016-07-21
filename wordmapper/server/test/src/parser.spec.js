var parser = require('../../src/parser');
var alignments_fixture = require('../fixtures/alignments.json');
var sources_fixture = require('../fixtures/sources.json');
var AlignmentsParser = parser.AlignmentsParser;
var SourcesParser = parser.SourcesParser;

describe('parser module', function() {
  it("parses alignments", function() {
    var parser = new AlignmentsParser(alignments_fixture);
    parser.parse();
    expect(parser.valid).toBe(true);
    expect(parser.alignments.length).toEqual(3);
  
    parser.alignments.forEach(function(alignment) {
      ['comment', 'words'].forEach(function(attr) {
        expect(alignment.hasOwnProperty(attr)).toBe(true);
      });
      expect(Array.isArray(alignment.words)).toBe(true);
      alignment.words.forEach(function(word) {
        ['index', 'value', 'source'].forEach(function(attr) {
          expect(word.hasOwnProperty(attr)).toBe(true);
        });
      });
    });
  });

  it("parses sources", function() {
    var parser = new SourcesParser(sources_fixture);
    parser.parse();
    expect(parser.valid).toBe(true);
    expect(parser.sources.length).toEqual(2);

    parser.sources.forEach(function(source) {
      ['hash', 'original', 'normalized'].forEach(function(attr) {
        expect(source.hasOwnProperty(attr)).toBe(true);
      });
    });
  });
});