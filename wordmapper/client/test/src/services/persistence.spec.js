var _ = require('lodash');
var services = require('../../../src/js/services.js');
var models = require('../../../src/js/models.js');
var Settings = require('../../../src/js/settings.js');

var Persistence = services.Persistence;

describe("Persistence service", function() {
  it("should have a constructor", function() {
    var options = {
      models: {
        alignments: new models.Alignments(),
        sources: new models.Sources(),
        user: new models.User()
      },
      settings: new Settings()
    };
    var persistence = new Persistence(options);
    expect(persistence instanceof Persistence);
  })
});