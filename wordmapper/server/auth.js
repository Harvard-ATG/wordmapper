var winston = require('winston');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var query = require('./query');
var config = require('./config');

var configurePassport = function(passport) {
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(email, password, done) {
      winston.info("authenticate via local strategy", {email:email});
      validatePassword(email, password).then(function(data) {
        winston.debug("validatedPassword success", data);
        return done(null, data);
      }).catch(function(err) {
        winston.debug("validatedPassword error:", err);
        return done(null, false, { message: 'Authentication failed'});
      });
    }
  ));
  passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: config.authSecret
    //issuer: "accounts.examplesoft.com",
    //audience: "yoursite.net"
  },
  function(jwt_payload, done) {
    winston.debug("authenticate via jwt strategy with jwt payload", jwt_payload);
    query.users.getUserById(jwt_payload.userId).then(function(data) {
      winston.debug("found user", data);
      return done(null, data);
    }).catch(function(err) {
      winston.debug("found user error", err);
      return done(null, false, { message: 'Authentication failed', error: err });
    });
  }));
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

var obtainJsonWebToken = function(userId) {
  var token = jwt.sign({ userId: userId }, config.authSecret);
  winston.debug("obtained json web token:", {token:token, decoded:jwt.decode(token)});
  return token;
};
var verifyJsonWebToken = function(token) {
  var decoded = false;
  try {
    winston.debug("verifying json web token: ", token);
    decoded = jwt.verify(token, config.authSecret);
    winston.debug("verified token: ", decoded);
  } catch(err) {
    winston.debug("json web token verification failed: ", err);
    return false;
  }
  return decoded.userId;
};

module.exports.obtainJsonWebToken = obtainJsonWebToken;
module.exports.verifyJsonWebToken = verifyJsonWebToken;
module.exports.configurePassport = configurePassport;
module.exports.hashPassword = hashPassword;
module.exports.comparePassword = comparePassword;
module.exports.validatePassword = validatePassword;
module.exports.ensureAuthenticated = ensureAuthenticated;