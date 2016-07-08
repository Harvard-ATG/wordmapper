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
	_getQuery: function() {
		return [
			'select ',
			'   a.id AS alignment_id',
			'   ,a.user_id AS user_id',
			'   ,a.comment AS comment',
			'   ,w.value AS word_value',
			'   ,w.index AS word_index',
			'   ,s.hash AS source_hash',
			'   ,s.id AS source_id'
			'from alignments a',
			'join alignment_word aw on a.id = aw.alignment_id',
			'join word w on w.id = aw.word_id',
			'join source s on s.id = w.source_id',
		].join(' ');
	},
	getAllAlignments: function() {
		return db.any(this._getQuery());
	},
	getAlignmentsByUser: function(userId, sources) {
		var query = this._getQuery(); 
		var params = {userId: userId};
		if(Array.isArray(sources) && sources.length > 0) {
			query += 'where a.user_id = ${userId} and s.hash in ${sources}';
			params.sources = sources;
		}
		return db.any(query, params);
	},
	deleteAlignmentsByUser: function() {
		var query = 'delete from alignments where user_id = ${userId}';
		return db.none(query, {userId: userId});
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
