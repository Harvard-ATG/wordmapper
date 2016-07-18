var User = require('../../../src/js/models/user.js');

describe("User Model", function() {
	it("should be created", function(){
		var options = {id: 1, email: 'foo@bar.com', token: 'tokenfoo'};
		var user = new User(options);
		expect(user.id).toBe(options.id);
		expect(user.email).toBe(options.email);
		expect(user.token).toBe(options.token);
		expect(user.isAuthenticated()).toBeTruthy();
	});
	it("is not authenticated without a token", function() {
		var options = {id: 1, email: 'foo@bar.com'};
		var user = new User(options);
		expect(user.isAuthenticated()).toBeFalsy();
		user.setToken("tokenbar");
		expect(user.token).toBe("tokenbar");
		expect(user.isAuthenticated()).toBeTruthy();
	});
	it("toString()", function() {
		var options = {id: 1, email: 'foo@bar.com', token: 'tokenfoo'};
		var user = new User(options);
		expect(user.toString()).toBe(user.email);
		expect(String(user)).toBe(user.email);
		expect("" + user).toBe(user.email);
	});
	it("toJSON()", function() {
		var options = {id: 1, email: 'foo@bar.com', token: 'tokenfoo'};
		var expected_json = {
			"type": "user",
			"data": {
				"id": options.id,
				"email": options.email
			}
		};
		var user = new User(options);
		expect(user.toJSON()).toEqual(expected_json);
	});
});
