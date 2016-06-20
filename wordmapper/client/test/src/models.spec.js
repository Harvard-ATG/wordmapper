var models = require('../../src/js/models.js');

describe("Models", function() {
  ['Alignments', 'Alignment', 'Word', 'Source', 'SiteContext'].forEach(function(model) {
    it("should have an " + model + " model", function() {
      expect(models[model]).toBeTruthy();
    });
  });
});