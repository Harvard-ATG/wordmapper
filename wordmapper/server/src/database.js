var path = require('path');
var winston = require('winston');
var config = require('./config');
var auth = require('./auth');
var pgp = require('pg-promise')({
	error: function(err, e) {
		winston.error("ERROR: ", err);
	},
	query: function(e) {
		winston.debug("QUERY: " + e.query);
	}
});
var db = pgp(config.database);

// Helper for loading queries from external files
function sqlfile(file) {
	return new pgp.QueryFile(path.join(__dirname, './sql/' + file), {minify: true});
}

// SQL loaded from external files
var sql = {
	alignments: {
		find: sqlfile('findAlignments.sql'),
		delete: sqlfile('deleteAlignments.sql'),
		userCountPerPage: sqlfile('getUserAlignmentCountPerPage.sql')
	},
	pages: {
		findSources: sqlfile('findPageSources.sql')
	}
};

// User queries
var users = {
	getAllUsers: function() {
		return db.any("select * from user_account_view");
	},
	getUserCount: function() {
		return db.one("select count(id) as count from user_account");
	},
	getUserByEmail: function(email) {
		var query = 'select * from user_account_view where email=${email}';
		return db.one(query, {email: email});
	},
	getUserById: function(id) {
		var query = 'select * from user_account_view where id=${id}';
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

// Alignment queries
var alignments = {
	getAllAlignments: function() {
		return db.any(sql.alignments.find);
	},
	getUserAlignmentCountPerPage: function(userId) {
		return db.any(sql.alignments.userCountPerPage, {userId:userId});
	},
	getAlignmentsByUser: function(userId, options) {
		options = options || {};
		if (!userId) {
			throw "Missing userId parameter";
		}
		var source_col = options.hasOwnProperty('sourceIds') ? 'source_id' : 'hash';
		var source_vals = options.hasOwnProperty('sourceIds') ? options.sourceIds : options.sourceHashes;
		var query = sql.alignments.find.query;
		var params = {userId: userId};
		var conds = ['user_id = ${userId}'];

		if(Array.isArray(source_vals) && source_vals.length > 0) {
			conds.push(source_col + ' in (${sources:csv})');
			params.sources = source_vals;
		}

		query += ' WHERE ' + conds.join(" AND ") + ' ORDER BY a.id';
		return db.any(query, params);
	},
	deleteAlignmentsByUser: function(userId, sources) {
		if (!userId) {
			throw "Missing userId parameter";
		}
		if (!sources) {
			throw "Missing sources parameter";
		}
		return db.none(sql.alignments.delete, {userId: userId, sources: sources});
	},
	createAlignments: function(userId, alignments) {
		var totalInserts = alignments.reduce(function(total, a) {
			return total + a.words.length;
		}, alignments.length);
	
		winston.debug("createAlignments", userId, "total inserts", totalInserts);
		winston.debug("alignments: ", alignments);

		return db.tx(function(t1) {
			var trackWords = {alignmentIndex: 0, wordIndex: 0};
			var alignmentIds = [];
			
			// sequence of inserts in a transaction: if any fail the entire operation should be rolled back
			return t1.sequence(function(index, data) {
				var alignment, word, values, sql;
				winston.debug("sequence", index, data, trackWords);
				if (data) {
					alignments[index-1].id = data.id;
				}
				
				// insert all the alignments first
				if (index < alignments.length) {
					winston.debug("insert alignment");
					sql = 'insert into alignment (user_id, comment) values (${userId}, ${comment}) returning id'
					return t1.one(sql, {userId: userId, comment:alignments[index].comment});
				
				// insert all the words next
				} else {
					alignment = alignments[trackWords.alignmentIndex];
					word = alignment.words[trackWords.wordIndex];
					values = [alignment.id, word.source, word.index, word.value];
					if (trackWords.wordIndex < alignment.words.length-1) {
						++trackWords.wordIndex;
					} else {
						trackWords.wordIndex = 0;
						++trackWords.alignmentIndex;
					}
					winston.debug('insert word', values);
					sql = 'insert into word (alignment_id, source_id, word_index, word_value) values ($1, (select id from source where hash = $2), $3, $4)'
					return t1.none(sql, values);
				}
			}, {limit: totalInserts});
		});
	}
};

// Source queries
var sources = {
	getAllSources: function() {
		return db.any('select id, hash, normalized, original from source');
	},
	getSourcesByHash: function(hashes) {
		return db.any('select id, hash, normalized, original from source where hash in (${hashes:csv})', {hashes:hashes});
	},
	createSources: function(sources) {
		return db.tx(function(t) {
			var queries = sources.map(function(source) {
				return t.one('insert into source (hash, normalized, original) values (${hash}, ${normalized}, ${original}) returning id, hash', source);
			});
			return t.batch(queries);
		});
	}
};

// Page queries
var pages = {
	getAllPages: function() {
		return db.any('select * from page');
	},
	getPageByUrl: function(url) {
		return db.one('select id, url from page where url = ${url}', {url:url});
	},
	getPageSourcesByUrl: function(url) {
		return db.many(sql.pages.findSources, {url:url});
	},
	createPage: function(url) {
		return db.one('insert into page (url) values (${url}) returning id', {url:url});
	},
	createPageSources: function(pageId, sourceIds) {
		var find_max_version = function(t) {
			return t.one('select coalesce(max(version), -1) as max_version from page_source where page_id = ${pageId}', {pageId:pageId});
		};
		var do_inserts = function(t, version) {
				var queries = sourceIds.map(function(sourceId) {
					return t.one('insert into page_source (page_id, source_id, version) values(${pageId}, ${sourceId}, ${version}) returning id', {
						pageId: pageId,
						sourceId: sourceId,
						version: version
					});
				});
				return t.batch(queries);
		};
		
		return db.tx(function(t) {
			return find_max_version(t).then(function(data) {
				return do_inserts(t, data.max_version + 1);
			});
		});
	}
};

module.exports.users = users;
module.exports.alignments = alignments;
module.exports.pages = pages;
module.exports.sources = sources;
