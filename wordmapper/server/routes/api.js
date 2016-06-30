var express = require('express');
var apiService = require('../services/api');
var router = express.Router();

var getQuerySources = function(query) {
	return ('sources' in query ? query.sources : '').split(',').filter(Boolean);
};

var sourcesRequired  = function(req, res, next) {
	var sources = getQuerySources(req.query);
	console.log("sourcesRequired", sources);
	if(sources.length > 0) {
		next();
	} else {
		res.json({ code: 400, message: "Invalid or missing sources in query" });
	}
};

// Base Endpoint.
router.get('/', function(req, res) {
	res.json({  message: 'Welcome to the API' });
});

// Authentication Endponit.
router.post('/auth', function(req, res) {
	console.log("authenticate");
	res.json({ code: 200, message: "Authenticated" });
});

// Alignments Endpoint.
router.route('/alignments')
.get(sourcesRequired, function(req, res) {
	res.json({ code: 200, message: "Fetched alignments", data: [] });
})
.delete(sourcesRequired, function(req, res) {
	res.json({ code: 204, message: "Deleted alignments"});
})
.post(function(req, res) {
	res.json({ code: 201, message: "Saved alignments", data: [] });
})
.put(function(req, res) {
	res.json({ code: 200, message: "Updated alignments"});
});

// Sites Endpoint.
router.route('/sites')
.get(function(req, res) {
	res.json({ code: 200, message: "Fetched sites", data: [] });
})
.post(function(req, res) {
	res.json({ code: 201, message: "Saved sites", data: [] });
});

module.exports = router;
