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
		res.status(400).json({ code: 400, message: "Invalid or missing sources in query" });
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
			res.json({
				code: 200,
				message: "Authenticated successfully",
				data: {
					id: user.id,
					email: user.email,
					token: token
				}
			});
		}).catch(function(err) {
			res.status(401).json({ code: 401, message: "Authentication failed: " + err });
		});
	} else {
		res.status(401).json({ code: 401, message: "Missing email and/or password" });
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
		res.status(500).json({ code: 500, message: "Error fetching alignments",  error: err.message});
	});
})
.delete(ensureAuthenticated(), sourcesRequired, function(req, res) {
	var sources = req.query.sources.split(',');
	repository.deleteAlignments(req.user.id, sources).then(function() {
		winston.log("deleted alignments");
		res.status(204).json({ code: 204, message: "Deleted alignments" });
	}).catch(function(err) {
		winston.error("error saving alignments: ", err);
		res.status(500).json({ code: 500, message: "Error deleting alignments",  error: err.message});
	});
})
.post(ensureAuthenticated(), function(req, res) {
	repository.saveAlignments(req.user.id, req.body).then(function() {
		winston.log("saved alignments");
		res.status(201).json({ code: 201, message: "Saved alignments" });
	}).catch(function(err) {
		winston.error("error saving alignments: ", err);
		res.status(500).json({ code: 500, message: "Error saving alignments",  error: err.message});
	});
});

// Sources Endpoint.
router.route('/sources')
.get(ensureAuthenticated(), function(req, res) {
	var hashes = ('hashes' in req.query ? req.query.hashes : '').split(',');
	var options = {fields: ['id', 'hash']};
	if ('fields' in req.query && req.query.fields) {
		options.fields = req.query.fields.split(',');
	}
	repository.fetchSources(hashes, options).then(function(sources) {
		if (sources.data.length == 0) {
			res.status(404).json({ code: 404, message: "Sources not found" });
		} else {
			res.json({ code: 200, message: "Fetched sources", data: sources });
		}
	}).catch(function(err) {
		winston.error("error fetching sources: ", err);
		res.status(500).json({ code: 500, message: "Error fetching sources",  error: err.message});
	});
})
.post(ensureAuthenticated(), function(req, res) {
	repository.saveSources(req.body).then(function(data) {
		res.status(201).json({ code: 201, message: "Saved sources", data: data });
	}).catch(function(err) {
		winston.error("error saving sources: ", err);
		res.status(500).json({ code: 500, message: "Error saving sources",  error: err.message});
	});
});

// Pages Endpoint.
router.route('/pages')
.get(ensureAuthenticated(), function(req, res) {
	res.json({ code: 200, message: "Fetched pages", data: [] });
})
.post(ensureAuthenticated(), function(req, res) {
	res.status(201).json({ code: 201, message: "Saved pages", data: [] });
});

module.exports = router;
