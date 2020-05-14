var Comment = require('../../../src/js/models/comment.js');

describe("Comment Model", function() {
  it("should be created with some text", function() {
    var text = "hello, world";
    var comment = new Comment({ text: text });
    expect(comment.text).toBe(text);
  });
  it("getText()", function() {
    var text = "hello, world";
    var comment = new Comment({ text: text });
    expect(comment.getText()).toBe(text);
  });
  it("toString()", function() {
    var text = "hello, world";
    var comment = new Comment({ text: text });
    expect(comment.toString()).toBe(text);
    expect(""+comment).toBe(text); // coerced object to string, should call toString()
  });
  it("toJSON()", function() {
    var text = "hello, world";
    var expected_json = {
      "type": "comment",
      "data": {
        "text": text
      }
    };
    var comment = new Comment({text:text});
    var given_json = comment.toJSON();
    expect(given_json.type).toBe("comment");
    expect(given_json.data).toEqual(expected_json.data);
  });
  it("serialize()", function() {
    var comment = new Comment({text: "test"});
    expect(comment.serialize()).toBeTruthy();
  });
});