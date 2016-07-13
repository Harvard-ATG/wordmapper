var winston = require('winston');
var database = require('./database');
var AlignmentsParser = require('./parser').AlignmentsParser;
var AlignmentsSerializer = require('./serializer').AlignmentsSerializer;

module.exports = {
	fetchAlignments: function(userId, sources) {
		var promise = database.alignments.getAlignmentsByUser(userId, {sources:sources});
		return promise.then(function(data) {
			var serializer = new AlignmentsSerializer(data);
			return serializer.asPromise();
		});
	},
	deleteAlignments: function(userId, sources) { 
		return database.alignments.deleteAlignmentsByUser(userId, sources);
	},
	saveAlignments: function(userId, data) {
		var parser = new AlignmentsParser(data);
		return parser.asPromise().then(function() {
			return database.sources.getSourcesByHash(parser.source_hashes);
		}).then(function(rows) {
			var sources = rows.map(function(row) { return row.id; });
			return database.alignments.deleteAlignmentsByUser(userId, sources);
		}).then(function() {
			return database.alignments.createAlignments({userId: userId, alignments: parser.alignments});
		});
	},
	saveSources: function(sources) {
		return database.sources.createSources(sources);
	},
	fetchSources: function(hashes) {
		return database.sources.getSourcesByHash(hashes);
	}
};
