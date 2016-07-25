var Page = require('../../../src/js/models/page.js');

describe("Page Model", function() {
  it("should be created with a hostname and url", function() {
    var args = {hostname:"www.domain.com", url: "http://www.domain.com/foo/bar/page1"};
    var page = new Page(args);
    expect(page.getHostname()).toBe(args.hostname);
    expect(page.getUrl()).toBe(args.url);
  });
  it("toString()", function() {
    var args = {hostname:"www.domain.com", url: "http://www.domain.com/foo/bar/page1"};
    var page = new Page(args);
    expect(page.toString()).toBe(args.url);
    expect(""+page).toBe(args.url);
  });
  it("toJSON()", function() {
    var args = {hostname:"www.domain.com", url: "http://www.domain.com/foo/bar/page1"};
    var page = new Page(args);
    var expected_json = {
      "type": "page",
      "data": {
        "hostname": args.hostname,
        "url": args.url
      }
    };
    var actual_json = page.toJSON();
    expect(actual_json.type).toBe(expected_json.type);
    expect(actual_json.data).toEqual(expected_json.data);
  });
  it("serialize()", function() {
    var args = {hostname:"www.domain.com", url: "http://www.domain.com/foo/bar/page1"};
    var page = new Page(args);
    expect(page.serialize()).toBeTruthy();
  });
});