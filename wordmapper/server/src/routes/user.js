var express = require('express');
var winston = require('winston');
var bodyParser = require('body-parser');
var passport = require('passport');
var query = require('../query');
var auth = require('../auth');
var router = express.Router();

var urlencodedParser = bodyParser.urlencoded({ extended: false });

// Index
router.get('/', function(req, res) {
	res.send('Welcome to the user interface!')
});

// Profile
router.get('/:userId(\\d+)', function(req, res) {
	res.send("User: " + req.params.userId);
});

// Login
router.route('/login')
.get(function(req, res) {
	res.render('login');
})
.post(urlencodedParser, passport.authenticate('local'), function(req, res) {
	winston.info("User logged via local authentication: " + req.body.email);
	res.redirect('/');
});

// Logout
router.route('/logout')
.get(function(req, res) {
  req.logout();
  res.redirect('/');
});

// Registration
router.route('/register')
.get(function(req, res) {
	res.render('register');
})
.post(urlencodedParser, function(req, res) {
	var email = (req.body.email || '').trim(); // strip whitespace from email
	var password = req.body.password || '';
	var confirmpassword = req.body.confirmpassword || '';

	auth.validateRegistrationPassword(password, confirmpassword).then(function() {
		return auth.validateRegistrationEmail(email);
	}).then(function() {
		return query.users.createUser(email, password);
	}).then(function() {
		return query.users.promoteFirstUser(email);
	}).then(function() {
		winston.info("Account created successfully: ", email);
		res.redirect("/user/login");
	}).catch(function(error) {
		res.render('register', {error: error, form: req.body});
	});
});

module.exports = router;
