var _ = require('lodash');
var Persistence = require('../../../src/js/services/persistence.js');

describe("Persistence service", function() {
  it("should have a constructor", function() {
    var persistence = new Persistence();
    expect(persistence instanceof Persistence);
  })
  it("should reject invalid storage types", function() {
    var persistence = new Persistence({ stores: ['foobar'] });
    expect(persistence.stores).toBe([]);
  });
});