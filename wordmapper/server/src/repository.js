var winston = require('winston');
var database = require('./database');
var AlignmentsParser = require('./parser').AlignmentsParser;

var Repository = {
	fetchAlignments: function(userId, sources) {
		throw "not implemented"; 
	},
	deleteAlignments: function(userId) { 
		throw "not implemented"; 
	},
	saveAlignments: function(data) {
		var executor = function(resolve, reject) {
			var parser = new AlignmentsParser(data);
			parser.parse();
			if (!parser.valid) {
				reject({message: "Error parsing data", errors: parser.errors});
			}
			resolve();
		};
		return new Promise(executor);

	},
	saveComments: function(data) { 
		throw "not implemented"; 
	},
	saveSources: function(sources) { 
		throw "not implemented"; 
	}
};

module.exports.Repository = Repository;