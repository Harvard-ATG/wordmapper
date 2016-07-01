var log = require('winston');
var config = require('./config');
var pgp = require('pg-promise')({
	error: function(err, e) {
		log.error("database error", err);
	}
});
var db = pgp(config.database);

module.exports = {
	alignments: {
		fetch: function() {
			return db.any("select * from alignment");
		},
		save: function() { },
		delete: function() { },
		update: function() { }
	},
	accounts: {
		fetch: function() {
			return db.any("select * from account");
		},
		save: function() { },
		delete: function() { },
		update: function() { }
	},
	pages: {
		fetch: function() {
			return db.any("select * from page");
		},
		save: function() { }
	}
};
