var express = require('express');
var log = require('winston');
var apiService = require('../services/api');
var router = express.Router();

var getQuerySources = function(query) {
	return ('sources' in query ? query.sources : '').split(',').filter(Boolean);
};

var sourcesRequired  = function(req, res, next) {
	var sources = getQuerySources(req.query);
	log.debug("text sources:", {sources: sources});
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

// Pages Endpoint.
router.route('/pages')
.get(function(req, res) {
	res.json({ code: 200, message: "Fetched pages", data: [] });
})
.post(function(req, res) {
	res.json({ code: 201, message: "Saved pages", data: [] });
});

module.exports = router;
