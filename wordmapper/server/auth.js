var winston = require('winston');
var bcrypt = require('bcrypt');
var LocalStrategy = require('passport-local').Strategy;
var query = require('./query');

var configurePassport = function(passport) {
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(email, password, done) {
      winston.debug("local strategy", {email:email});
      validatePassword(email, password).then(function(data) {
        winston.debug("validatedPassword success:", data);
        return done(null, data);
      }).catch(function(err) {
        winston.debug("validatedPassword error:", err);
        return done(null, false, { message: 'Authentication failed'});
      });
    }
  ));
  passport.serializeUser(function(user, done) {
    winston.debug("serializeUser", user);
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
    winston.debug("deserializeUser", {id:id});
    query.users.getUserById(id).then(function(user) {
      done(null, user);
    }).catch(function(err) {
      done(err);
    });
  });
};

var hashPassword = function (password) {
  var saltRounds = 10;
  var salt = bcrypt.genSaltSync(saltRounds);
  var pwhash = bcrypt.hashSync(password, salt);
  return pwhash;
};

var comparePassword = function(plaintext, pwhash) {
  return bcrypt.compareSync(plaintext, pwhash);
};

var validatePassword = function (email, password) {
  return new Promise(function(resolve, reject) {
    query.users.getUserByEmail(email).then(function(user) {
      var valid = comparePassword(password, user.password);
      if(valid) {
        resolve(user);
      } else {
        reject('Invalid password');
      }
    }).catch(function(err) {
      reject('Invalid email');
    });
  });
};

var ensureAuthenticated = function(valid, invalid) {
  valid = valid || function() {};
  invalid = invalid || function() {};
  return function(req, res, next) {
    if(req.isAuthenticated()) {
      valid(req, res);
      next();
    } else {
      invalid(req, res);
    }
  };
};

module.exports.configurePassport = configurePassport;
module.exports.hashPassword = hashPassword;
module.exports.comparePassword = comparePassword;
module.exports.validatePassword = validatePassword;
module.exports.ensureAuthenticated = ensureAuthenticated;