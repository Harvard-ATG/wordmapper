var winston = require('winston');
var database = require('./database');
var parser = require('./parser');
var AlignmentsParser = parser.AlignmentsParser;

module.exports = {
	fetchAlignments: function(userId, sources) {
		return database.alignments.getAlignmentsByUser(userId, {sources:sources});
	},
	deleteAlignments: function(userId, sources) { 
		return database.alignments.deleteAlignmentsByUser(userId, sources);
	},
	saveAlignments: function(userId, data) {
		var parser = new AlignmentsParser(data);
		return parser.asPromise().then(function(alignments) {
			return database.alignments.createAlignments({userId: userId, alignments: alignments});
		});
	},
	saveSources: function(sources) {
		return database.sources.createSources(sources);
	},
	fetchSources: function(hashes) {
		return database.sources.getSourcesByHash(hashes);
	}
};