var SiteContext = require('../../../src/js/models/site_context.js');

describe("SiteContext Model", function() {
  it("should be created with an id and url", function() {
    var args = {id:"www.domain.com", url: "http://www.domain.com/foo/bar/page1"};
    var site_context = new SiteContext(args);
    expect(site_context.id).toBe(site_context.id);
    expect(site_context.url).toBe(site_context.url);
  });
  it("toString()", function() {
    var args = {id:"www.domain.com", url: "http://www.domain.com/foo/bar/page1"};
    var site_context = new SiteContext(args);
    expect(site_context.toString()).toBe(args.url);
    expect(""+site_context).toBe(args.url);
  });
  it("toJSON()", function() {
    var args = {id:"www.domain.com", url: "http://www.domain.com/foo/bar/page1"};
    var site_context = new SiteContext(args);
    var expected_json = {
      "type": "siteContext",
      "data": {
        "id": args.id,
        "url": args.url
      }
    };
    var actual_json = site_context.toJSON();
    expect(actual_json.type).toBe(expected_json.type);
    expect(actual_json.data).toEqual(expected_json.data);
  });
  it("serialize()", function() {
    var args = {id:"www.domain.com", url: "http://www.domain.com/foo/bar/page1"};
    var site_context = new SiteContext(args);
    expect(site_context.serialize()).toBeTruthy();
  });
});