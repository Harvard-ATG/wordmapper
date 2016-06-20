var Word = require('../../../src/js/models/word.js');
var Alignment = require('../../../src/js/models/alignment.js');

var source_fixture = {index: 0, hash: "_some_hash_"};
var source_fixture2 = {index: 1, hash: "_some_OTHER_hash"};

describe("Alignment Model", function() {
  it("should be created with words", function() {
    var word = new Word({index:0,value:"foo",source:source_fixture});
    var words = [word];
    var alignment = new Alignment({id: 1, words: words });
    expect(alignment.id).toBe(1);
    expect(Array.isArray(alignment.words)).toBe(true);
    expect(alignment.words.length).toBe(1);
  });
  it("should raise an exception if not constructed properly", function() {
    var word = new Word({index:0,value:"foo",source:source_fixture});
    var words = [word];
    expect(function() { new Alignment() }).toThrow();
    expect(function() { new Alignment({ id: 0 }); }).toThrow();
    expect(function() { new Alignment({ words: [] }); }).toThrow();
    expect(function() { new Alignment({ words: words }); }).toThrow();
    expect(function() { new Alignment({ id: 0, words: words }); }).not.toThrow();
    
    // Alignment identifier must be a number or non-empty string
    expect(function() { new Alignment({ id: null, words: words }); }).toThrow();
    expect(function() { new Alignment({ id: '', words: words }); }).toThrow();
  });
  it("should know how to find a word", function() {
    var word1 = new Word({index:0,value:"foo",source:source_fixture});
    var word2 = new Word({index:1,value:"foo",source:source_fixture});
    var word3 = new Word({index:2,value:"foo",source:source_fixture});
    var words = [word1, word2];
    var alignment = new Alignment({id: 1, words: words });
    expect(alignment.findWord(word1)).toEqual({word:word1, index:0});
    expect(alignment.findWord(word2)).toEqual({word:word2, index:1});
    expect(alignment.findWord(word3)).toBe(false);
  });
  it("should be able to check if it contains a word", function() {
    var word1 = new Word({index:0,value:"foo",source:source_fixture});
    var word2 = new Word({index:1,value:"foo",source:source_fixture});
    var words = [word1];
    var alignment = new Alignment({id: 1, words: words });
    expect(alignment.containsWord(word1)).toBe(true);
    expect(alignment.containsWord(word2)).toBe(false);
  });
  it("should be able to remove a word", function() {
    var word1 = new Word({index:0,value:"foo",source:source_fixture});
    var word2 = new Word({index:1,value:"foo",source:source_fixture});
    var word3 = new Word({index:2,value:"foo",source:source_fixture});
    var words = [word1, word2, word3];
    var size = words.length;
    var alignment = new Alignment({id: 1, words: words });
    expect(alignment.size()).toBe(size);
    alignment.removeWord(word2);
    expect(alignment.size()).toBe(size - 1);
    expect(alignment.containsWord(word2)).toBe(false);
  });
  it("should know how to group words by source", function() {
    var word1 = new Word({index:0,value:"foo",source:source_fixture2});
    var word2 = new Word({index:1,value:"foo",source:source_fixture});
    var word3 = new Word({index:2,value:"foo",source:source_fixture});
    var words = [word1, word2, word3];
    var alignment = new Alignment({id: 1, words: words });
    var word_groups = alignment.wordGroups();
    
    // there should be two word groups because there are two sources
    expect(word_groups.length).toBe(2); 
    
    // word groups should be ordered by source index
    expect(word_groups[0]).toEqual([word2,word3]);
    expect(word_groups[1]).toEqual([word1]);
  });
  it("should know its size", function() {
    var word = new Word({index:0,value:"foo",source:source_fixture});
    var words = [word];
    var alignment = new Alignment({id: 1, words: words });
    expect(alignment.words.length).toEqual(words.length);
  });
  it("should know if it's empty or not", function() {
    var word = new Word({index:0,value:"foo",source:source_fixture});
    var words = [word];
    var alignment = new Alignment({id: 1, words: words });
    expect(alignment.isEmpty()).toBe(false);
    alignment.words = [];
    expect(alignment.isEmpty()).toBe(true);
  });
  it("should know its minimum word index", function() {
    var word1 = new Word({index:14,value:"foo",source:source_fixture});
    var word2 = new Word({index:13,value:"foo",source:source_fixture2});
    var word3 = new Word({index:15,value:"foo",source:source_fixture});
    var words = [word1, word2, word3];
    var alignment = new Alignment({id: 1, words: words });
    
    expect(alignment.minWordIndex()).toBe(word2.index);
  });
  it("should know its minimum source index", function() {
    var word1 = new Word({index:14,value:"foo",source:source_fixture});
    var word2 = new Word({index:13,value:"foo",source:source_fixture2});
    var word3 = new Word({index:15,value:"foo",source:source_fixture});
    var words = [word1, word2, word3];
    var alignment = new Alignment({id: 1, words: words });

    expect(alignment.minSourceIndex()).toBe(source_fixture.index);
  });
  it("toString()", function() {
    var word1 = new Word({index:0,value:"foo",source:source_fixture});
    var word2 = new Word({index:0,value:"bar",source:source_fixture2});
    var words = [word1, word2];
    var alignment = new Alignment({id: 1, words: words });
    expect(alignment.toString()).toEqual(word1.toString() + " - " + word2.toString());
  });
  it("toJSON()", function() {
    var word = new Word({index:0,value:"foo",source:source_fixture});
    var words = [word];
    var alignment = new Alignment({id: 1, words: words });
    var actual_json = alignment.toJSON();
    expect(actual_json.type).toBe("alignment");
    expect(actual_json.data).toEqual(words.map(function(word) {
      return word.toJSON();
    }));
  });
});