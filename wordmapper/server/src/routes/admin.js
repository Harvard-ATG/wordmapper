var express = require('express');
var auth = require('../auth');
var router = express.Router();

var ensureAuthenticated = auth.ensureAuthenticated(null, function(req, res) {
	res.status(401).send('Authenticated required');
	//res.redirect('/user/login');
});
var ensureAuthorized = function(req, res, next) {
	next();
};
var ensureAuth = [ensureAuthenticated, ensureAuthorized];

router.get('/', ensureAuth, function(req, res) {
	res.render('admin_home');
});

module.exports = router;
