var winston = require('winston');
var database = require('./database');
var parser = require('./parser');
var serializer = require('./serializer');

var AlignmentsParser = parser.AlignmentsParser;
var AlignmentsSerializer = serializer.AlignmentsSerializer;
var SourcesParser = parser.SourcesParser;
var SourcesSerializer = serializer.SourcesSerializer;

module.exports = {
	fetchAlignments: function(userId, sources) {
		var is_list_of_ids = sources.filter(function(source) {
			return /^\d+$/.test(source);
		}).length > 0;
		
		var options = {};
		if (is_list_of_ids) {
			options.sourceIds = sources;
		} else {
			options.sourceHashes = sources;
		}
		
		var promise = database.alignments.getAlignmentsByUser(userId, options);
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
			return database.alignments.createAlignments(userId, parser.alignments);
		});
	},
	saveSources: function(data) {
		var parser = new SourcesParser(data);
		return parser.asPromise().then(function() {
			return database.sources.createSources(parser.sources);
		});
	},
	fetchSources: function(hashes, options) {
		options = options || {};
		var promise = database.sources.getSourcesByHash(hashes);
		return promise.then(function(data) {
			var serializer = new SourcesSerializer(data, options);
			return serializer.asPromise();
		});
	}
};
