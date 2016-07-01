var express = require('express');
var log = require('winston');
var jwt = require('jsonwebtoken');
var config = require('../config');
var apiService = require('../services/api');
var router = express.Router();

var getQuerySources = function(req) {
	return ('sources' in req.query ? req.query.sources : '').split(',').filter(Boolean);
};

var getAuthToken = function(req) {
	var header = req.get('Authorization') || '';
	return header.split('Bearer ')[1];
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

var authRequired = function(req, res, next) {
	var token = getAuthToken(req), decoded;
	if(!token) {
		res.json({ code: 401, message: 'Authentication required' });
	} else {
		try {
			decoded = jwt.verify(token, config.authSecret);
		} catch (err) {
			log.error("authentication failed", {token: token});
			res.json({ code: 403, message: 'Authentication failed'});
		}
		req.auth = decoded;
		next();
	}
};	

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
.get(authRequired, sourcesRequired, function(req, res) {
	res.json({ code: 200, message: "Fetched alignments", data: [] });
})
.delete(authRequired, sourcesRequired, function(req, res) {
	res.json({ code: 204, message: "Deleted alignments"});
})
.post(authRequired, function(req, res) {
	res.json({ code: 201, message: "Saved alignments", data: [] });
})
.put(authRequired, function(req, res) {
	res.json({ code: 200, message: "Updated alignments"});
});

// Pages Endpoint.
router.route('/pages')
.get(authRequired, function(req, res) {
	res.json({ code: 200, message: "Fetched pages", data: [] });
})
.post(authRequired, function(req, res) {
	res.json({ code: 201, message: "Saved pages", data: [] });
});

module.exports = router;
