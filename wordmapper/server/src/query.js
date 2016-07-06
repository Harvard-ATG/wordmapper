var winston = require('winston');
var config = require('./config');
var auth = require('./auth');
var pgp = require('pg-promise')({
	error: function(err, e) {
		winston.error("database error", err);
	}
});
var db = pgp(config.database);

var users = {
	getAllUsers: function() {
		return db.any("select * from user_account");
	},
	getUserCount: function() {
		return db.one("select count(id) as count from user_account");
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
		var pwhash = auth.hashPassword(password); 
		var query = 'insert into user_account (email, password) values (${email}, ${pwhash})';
		return db.none(query, {email: email, pwhash: pwhash});
	},
	deleteUserById: function(id) {
		var query = 'delete from user_account where id = ${id}';
		return db.none(query, {id:id});
	},
	promoteToAdmin: function(email) {
		var query = 'insert into user_admin (email) values (${email})';
		return db.none(query, {email: email});
	},
	promoteFirstUser: function(email) {
		return new Promise(function(resolve, reject) {
			users.getUserCount().then(function(data) {
				if (data.count == 1) {
					return users.promoteToAdmin(email);
				} else {
					return Promise.resolve("not promoted because first user already exists");
				}
			}).then(function() {
				resolve("promotion completed");
			}).catch(function(err) {
				resolve("promotion completed");
				winston.error(err);
			});
		});
	},
	checkAdminByEmail: function(email) {
		var query = 'select 1 from user_admin where email=${email}';
		return db.one(query, {email:email});
	},
	checkAdminById: function(id) {
		var query = 'select 1 from user_admin a join user_account u on u.email = a.email where u.id=${id}';
		return db.one(query, {id:id});
	}
};

var alignments = {
	getAllAlignments: function() {
		return db.any('select * from alignment');
	},
	getAlignmentsByUser: function(userId) {
		var query = 'select * from alignments where user_id = ${userId}';
		return db.any(query, {userId: userId});
	}
};

var pages = {
	getAllPages: function() {
		return db.any('select * from page');
	}
};

module.exports.db = db;
module.exports.users = users;
module.exports.alignments = alignments;
module.exports.pages = pages;
