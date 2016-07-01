var winston = require('winston');
var config = require('./config');
var utils = require('./utils');
var pgp = require('pg-promise')({
	error: function(err, e) {
		winston.error("database error", err);
	}
});
var db = pgp(config.database);

module.exports = {
	db: db,
	alignments: {
		getAllAlignments: function() {
			return db.any('select * from alignment');
		},
		getAlignmentsByUser: function(userId) {
			var query = 'select * from alignments where user_id = ${userId}';
			return db.any(query, {userId: userId});
		}
	},
	users: {
		getAllUsers: function() {
			return db.any("select * from account");
		},
		getUserByEmail: function(email) {
			var query = 'select * from user_account where email=${email}';
			return db.one(query, {email: email});
		},
		getUserById: function(id) {
			var query = 'select * from user_account where id=${id}';
			return db.one(query, {id: id});
		},
		createUser: function(email, password) {
			winston.log("create user", {email:email});
			var pwhash = utils.hashPassword(password); 
			var query = 'insert into user_account (email, password) values (${email}, ${pwhash})';
			return db.none(query, {email: email, pwhash: pwhash});
		},
		validatePassword: function(email, password) {
			var userPromise = this.getUserByEmail(email);
			return new Promise(function(resolve, reject) {
				userPromise.then(function(user) {
					var valid = utils.comparePassword(password, user.password);
					if(valid) {
						resolve(user);
					} else {
						reject('Invalid password');
					}
				}).catch(function(err) {
					reject('Invalid email');
				});
			});
		},
		deleteUserById: function(id) {
			var query = 'delete from user_account where id = ${id}';
			return db.none(query, {id:id});
		}
	},
	pages: {
		getAllPages: function() {
			return db.any('select * from page');
		}
	}
};
