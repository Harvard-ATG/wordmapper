var winston = require('winston');
var query = require('./query');

var Interface = {
	fetchAlignments: function(userId, sources) {
		throw "not implemented"; 
	},
	deleteAlignments: function(userId) { 
		throw "not implemented"; 
	},
	saveAlignments: function(data) { 
		throw "not implemented"; 
	},
	saveComments: function(data) { 
		throw "not implemented"; 
	},
	saveSources: function(sources) { 
		throw "not implemented"; 
	}
};

for(var method in Interface) {
	module.exports[method] = Interface[method];
}
