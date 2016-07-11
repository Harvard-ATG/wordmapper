var winston = require('winston');
var config = require('./config');
var auth = require('./auth');
var pgp = require('pg-promise')({
	error: function(err, e) {
		winston.error("database error", err);
	}
});
var db = pgp(config.database);

// Helper for linking to external query files: 
function sql(file) {
    return new pgp.QueryFile(file, {minify: true});
}

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
		var query = sql('./sql/findAlignments.sql');
		return db.any(query);
	},
	getAlignmentsByUser: function(userId, sources) {
		if (!userId) {
			throw "Missing userId parameter";
		}
		var query = sql('./sql/findAlignmentsByUser.sql');
		var params = {userId: userId};
		var wheres = ['a.user_id = ${userId}'];

		if(Array.isArray(sources) && sources.length > 0) {
			wheres.push('s.hash in ${sources:csv}');
			params.sources = sources;
		}

		query += ' WHERE ' + wheres.join(" AND ");

		return db.any(query, params);
	},
	deleteAlignmentsByUser: function() {
		var query = 'delete from alignments where user_id = ${userId}';
		return db.none(query, {userId: userId});
	},
	createAlignment: function(userId, comment, words) {
		return db.tx(function(t) {
			var sql1 = 'insert into alignment (user_id, comment) values (${userId}, ${comment}) returning id';
			var q1 = t.one(sql1, {userId:userId, comment:comment}).then(function(alignmentId) {
				var sql2 = 'insert into word (alignment_id, source_hash, word_index, word_value) values (${words}) returning id';
				var values = words.map(function(word) {
					return [alignmentId, word.source, word.index, word.value];
				});
				return t.any(sql2, {words: values});
			});
			return t.batch([q1]);
		});
	}
};

var sources = {
	getAllSources: function() {
		return db.any('select * from source');
	}
};

var pages = {
	getAllPages: function() {
		return db.any('select * from page');
	}
};

module.exports.users = users;
module.exports.alignments = alignments;
module.exports.pages = pages;
module.exports.sources = sources;
