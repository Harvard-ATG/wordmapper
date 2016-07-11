var express = require('express');
var winston = require('winston');
var passport = require('passport');
var bodyParser = require('body-parser');
var config = require('../config');
var auth = require('../auth');
var router = express.Router();

var getQuerySources = function(req) {
	return ('sources' in req.query ? req.query.sources : '').split(',').filter(Boolean);
};
var sourcesRequired  = function(req, res, next) {
	var sources = getQuerySources(req);
	winston.debug("text sources:", {sources: sources});
	if(sources.length > 0) {
		next();
	} else {
		res.json({ code: 400, message: "Invalid or missing sources in query" });
	}
};

var ensureAuthenticated = function() {
	return passport.authenticate('jwt', { session: false});
};

router.use(bodyParser.json());

// Base Endpoint.
router.get('/', function(req, res) {
	res.json({  message: 'Welcome to the API' });
});

// Authentication Endpoint.
router.post('/auth/login', function(req, res) {
	var email = req.body.email || '';
	var password = req.body.password || '';
	if (email && password) {
		auth.validatePassword(email, password).then(function(user) {
			var token = auth.obtainJsonWebToken(user.id);
			res.json({ code: 200, message: "Authenticated successfully", token: token });
		}).catch(function(err) {
			res.json({ code: 401, message: "Authentication failed: " + err });
		});
	} else {
		res.json({ code: 401, message: "Missing email and/or password" });
	}
});
router.get('/auth/verify', ensureAuthenticated(), function(req, res) {
	res.json({ code: 200, message: 'Verified' });
});

// Alignments Endpoint.
router.route('/alignments')
.get(ensureAuthenticated(), sourcesRequired, function(req, res) {
	res.json({ code: 200, message: "Fetched alignments", data: [] });
})
.delete(ensureAuthenticated(), sourcesRequired, function(req, res) {
	res.json({ code: 204, message: "Deleted alignments"});
})
.post(ensureAuthenticated(), function(req, res) {
	winston.info("user", req.user);
	winston.info("body", req.body);
	res.json({ code: 201, message: "Saved alignments", data: [] });
});

// Pages Endpoint.
router.route('/pages')
.get(ensureAuthenticated(), function(req, res) {
	res.json({ code: 200, message: "Fetched pages", data: [] });
})
.post(ensureAuthenticated(), function(req, res) {
	res.json({ code: 201, message: "Saved pages", data: [] });
});

module.exports = router;
