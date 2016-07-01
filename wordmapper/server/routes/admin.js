var express = require('express');
var utils = require('../utils');
var router = express.Router();

var ensureAuthenticated = utils.ensureAuthenticated(null, function(req, res) {
	res.status(401).send('Authenticated required');
	//res.redirect('/user/login');
});
var ensureAuthorized = function(req, res, next) {
	next();
};
var ensureAuth = [ensureAuthenticated, ensureAuthorized];

router.get('/', ensureAuth, function(req, res) {
	res.send('hooray! welcome to our admin interface!')
});

module.exports = router;
