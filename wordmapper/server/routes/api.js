var express = require('express');
var log = require('winston');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var config = require('../config');
var utils = require('../utils');
var apiService = require('../services/api');
var router = express.Router();

var getQuerySources = function(req) {
	return ('sources' in req.query ? req.query.sources : '').split(',').filter(Boolean);
};
var sourcesRequired  = function(req, res, next) {
	var sources = getQuerySources(req);
	log.debug("text sources:", {sources: sources});
	if(sources.length > 0) {
		next();
	} else {
		res.json({ code: 400, message: "Invalid or missing sources in query" });
	}
};

var ensureAuthenticated = utils.ensureAuthenticated(null, function(req, res) {
	res.json({ code: 401, message: "Authenticated required" });
});

router.use(bodyParser.json());

// Base Endpoint.
router.get('/', function(req, res) {
	res.json({  message: 'Welcome to the API' });
});

// Authentication Endpoint.
router.post('/auth/login', function(req, res) {
	var email = req.body.email || '';
	var password = req.body.password || '';
	res.json({ code: 200, message: "Authenticated" });
});

// Alignments Endpoint.
router.route('/alignments')
.get(ensureAuthenticated, sourcesRequired, function(req, res) {
	res.json({ code: 200, message: "Fetched alignments", data: [] });
})
.delete(ensureAuthenticated, sourcesRequired, function(req, res) {
	res.json({ code: 204, message: "Deleted alignments"});
})
.post(ensureAuthenticated, function(req, res) {
	res.json({ code: 201, message: "Saved alignments", data: [] });
})
.put(ensureAuthenticated, function(req, res) {
	res.json({ code: 200, message: "Updated alignments"});
});

// Pages Endpoint.
router.route('/pages')
.get(function(req, res) {
	res.json({ code: 200, message: "Fetched pages", data: [] });
})
.post(ensureAuthenticated, function(req, res) {
	res.json({ code: 201, message: "Saved pages", data: [] });
});

module.exports = router;
