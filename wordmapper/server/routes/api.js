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

router.post('/auth', function(req, res) {
	console.log("authenticate");
	res.json({ code: 200, message: "Authenticated" });
});

// Get alignments.
router.get('/alignments', sourcesRequired, function(req, res) {
	console.log(req.query);
	res.json({ code: 200, data: [] });
});

// Delete alignments 
router.delete('/alignments', sourcesRequired, function(req, res) {
	res.json({ code: 204, message: "Deleted alignments"});
});

// Create alignments
router.post('/alignments', function(req, res) {
	res.json({ code: 201, message: "Saved alignments", data: [] });
});

// Update alignments 
router.put('/alignments', function(req, res) {
	res.json({ code: 200, message: "Updated alignments"});
});

// Base API url
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' })
});

module.exports = router;
