var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
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
	res.send("Logged in! " + req.body.email);
});

// Registration
router.route('/register')
.get(function(req, res) {
	res.render('register');
})
.post(function(req, res) {
	res.send("Registered!");
});

module.exports = router;
