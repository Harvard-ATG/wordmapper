var Page = require('../../../src/js/models/page.js');

describe("Page Model", function() {
  it("should be created with a hostname and url", function() {
    var args = {id:"www.domain.com", url: "http://www.domain.com/foo/bar/page1"};
    var page = new Page(args);
    expect(page.id).toBe(page.id);
    expect(page.url).toBe(page.url);
  });
  it("toString()", function() {
    var args = {id:"www.domain.com", url: "http://www.domain.com/foo/bar/page1"};
    var page = new Page(args);
    expect(page.toString()).toBe(args.url);
    expect(""+page).toBe(args.url);
  });
  it("toJSON()", function() {
    var args = {id:"www.domain.com", url: "http://www.domain.com/foo/bar/page1"};
    var page = new Page(args);
    var expected_json = {
      "type": "page",
      "data": {
        "hostname": args.id,
        "url": args.url
      }
    };
    var actual_json = page.toJSON();
    expect(actual_json.type).toBe(expected_json.type);
    expect(actual_json.data).toEqual(expected_json.data);
  });
  it("serialize()", function() {
    var args = {id:"www.domain.com", url: "http://www.domain.com/foo/bar/page1"};
    var page = new Page(args);
    expect(page.serialize()).toBeTruthy();
  });
});