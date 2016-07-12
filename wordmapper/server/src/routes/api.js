var express = require('express');
var winston = require('winston');
var passport = require('passport');
var bodyParser = require('body-parser');
var config = require('../config');
var auth = require('../auth');
var repository = require('../repository');
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
	var sources = req.query.sources.split(',');
	repository.fetchAlignments(req.user.id, sources).then(function(data) {
		winston.log("fetched alignments", data);
		res.json({ code: 200, message: "Fetched alignments", data: data });
	}).catch(function(err) {
		winston.error("error saving alignments: ", err);
		res.json({ code: 500, message: "Error fetching alignments",  error: err.message});
	});
})
.delete(ensureAuthenticated(), sourcesRequired, function(req, res) {
	var sources = req.query.sources.split(',');
	repository.deleteAlignments(req.user.id, sources).then(function() {
		winston.log("deleted alignments");
		res.json({ code: 204, message: "Deleted alignments" });
	}).catch(function(err) {
		winston.error("error saving alignments: ", err);
		res.json({ code: 500, message: "Error deleting alignments",  error: err.message});
	});
})
.post(ensureAuthenticated(), function(req, res) {
	repository.saveAlignments(req.user.id, req.body).then(function() {
		winston.log("saved alignments");
		res.json({ code: 201, message: "Saved alignments" });
	}).catch(function(err) {
		winston.error("error saving alignments: ", err);
		res.json({ code: 500, message: "Error saving alignments",  error: err.message});
	});
});

// Sources Endpoint.
router.route('/sources')
.get(ensureAuthenticated(), function(req, res) {
	var hashes = ('hashes' in req.query ? req.query.hashes : '').split(',');
	repository.fetchSources(hashes).then(function(data) {
		res.json({ code: 200, message: "Fetched sources", data: data });
	}).catch(function(err) {
		winston.error("error fetching sources: ", err);
		res.json({ code: 500, message: "Error saving sources",  error: err.message});
	});
})
.post(ensureAuthenticated(), function(req, res) {
	var sources = ('sources' in req.body ? req.body.sources || [] : []);
	repository.saveSources(sources).then(function(data) {
		res.json({ code: 201, message: "Saved sources", data: data });
	}).catch(function(err) {
		winston.error("error saving sources: ", err);
		res.json({ code: 500, message: "Error saving sources",  error: err.message});
	});
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
