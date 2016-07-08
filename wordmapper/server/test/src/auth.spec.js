var auth = require('../../src/auth');

describe('auth', function() {
	describe('password hashing', function() {
		it('should be able to hash a plaintext password', function() {
			var password = 'something';
			var hash = auth.hashPassword(password);
			expect(password).not.toEqual(hash);
		});
		it('should be able to compare a password hash', function() {
			var password = 'something';
			var hash = auth.hashPassword(password);
			expect(auth.comparePassword(password, hash)).toBeTruthy();
			expect(auth.comparePassword(password + 'foo', hash)).toBeFalsy();
			expect(auth.comparePassword(hash, hash)).toBeFalsy();
		});
	});	
	describe('password registration validation', function() {
		var MIN_PW_SIZE = 4;
		it('should reject passwords that are empty or too short', function() {
			[null, '', Array(MIN_PW_SIZE-1).fill('x').join('')].forEach(function(password) {
				var promise = auth.validateRegistrationPassword(password, password);
				promise.then(fail, function(err) {
					expect(err).toBeTruthy();
				});
			});
		});
		it('should reject passwords that do not match', function() {
			var pass1 = Array(MIN_PW_SIZE).fill('x').join('');
			var pass2 = Array(MIN_PW_SIZE).fill('y').join('');
			var promise = auth.validateRegistrationPassword(pass1, pass2);
			promise.then(fail, function(err) {
				expect(err).toContain("do not match");
			});
		});
	});
	describe('json web tokens', function() {
		it('should obtain a jwt containing a user id', function() {
			var userId = 1;
			var token = auth.obtainJsonWebToken(userId);
			var decoded = auth.decodeJsonWebToken(token);
			expect(token).toBeTruthy();
			expect('userId' in decoded).toBeTruthy();
			expect(decoded.userId).toBe(userId);
		});
		it('should verify a jwt', function() {
			var userId = 1;
			var token = auth.obtainJsonWebToken(userId);
			expect(auth.verifyJsonWebToken(token)).toBe(userId);
			expect(auth.verifyJsonWebToken(token+"GARBAGE")).toBe(false);
		});
	});
});
