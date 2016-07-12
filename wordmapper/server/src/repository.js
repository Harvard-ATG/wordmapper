var winston = require('winston');
var database = require('./database');
var AlignmentsParser = require('./parser').AlignmentsParser;

module.exports = {
	fetchAlignments: function(userId, sources) {
		throw "not implemented"; 
	},
	deleteAlignments: function(userId) { 
		throw "not implemented"; 
	},
	saveAlignments: function(userId, data) {
		var parser = new AlignmentsParser(data);
		return parser.asPromise().then(function(alignments) {
			return database.alignments.createAlignments({userId: userId,alignments: alignments});
		});
	},
	saveComments: function(data) { 
		throw "not implemented"; 
	},
	saveSources: function(sources) { 
		throw "not implemented"; 
	}
};