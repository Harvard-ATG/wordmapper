var parser = require('../../src/parser');
var fixture_data = require('../fixtures/alignments.json');
var AlignmentsParser = parser.AlignmentsParser;

describe('parser', function() {
  it("extracts alignments", function() {
    var parser = new AlignmentsParser(fixture_data);
    parser.parse();
    console.log(parser);
    expect(parser.valid).toBe(true);
    expect(parser.alignments.length).toEqual(3);
    parser.alignments.forEach(function(alignment) {
      expect(alignment.hasOwnProperty("comment")).toBe(true);
      expect(alignment.hasOwnProperty("words")).toBe(true);
      expect(Array.isArray(alignment.words)).toBe(true);
      alignment.words.forEach(function(word) {
        expect(word.hasOwnProperty('index')).toBe(true);
        expect(word.hasOwnProperty('value')).toBe(true);
        expect(word.hasOwnProperty('source')).toBe(true);
      });
    });
  });
});