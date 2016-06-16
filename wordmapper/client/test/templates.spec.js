var templates = require('../src/js/templates.js');

describe("Templates", function() {
  ['panel', 'index', 'export'].forEach(function(template) {
    it("should have an " + template + " template", function() {
      expect(templates[template]).toBeTruthy();
    });
  });
});