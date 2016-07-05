var express = require('express');
var winston = require('winston');
var bodyParser = require('body-parser');
var passport = require('passport');
var query = require('../query');
var router = express.Router();

var urlencodedParser = bodyParser.urlencoded({ extended: false });

// Index
router.get('/', function(req, res) {
	res.send('hooray! welcome to our user interface!')
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
	winston.log("Logged in successfully as " + req.body.email + "!");
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
	query.users.createUser(req.body.email, req.body.password).then(function() {
		res.send("Account created successfully!");
	}).catch(function(err) {
		winston.error(err);
		res.send("Error creating your account");
	});
});

module.exports = router;
