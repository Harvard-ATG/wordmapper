var winston = require('winston');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var database = require('./database');
var config = require('./config');

// Configures PassportJS authentication strategies.
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
    database.users.getUserById(jwt_payload.userId).then(function(data) {
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
    database.users.getUserById(id).then(function(user) {
      done(null, user);
    }).catch(function(err) {
      done(err);
    });
  });
};

// Returns a bcrypt hash of a plaintext password, suitable for storing
// in a database.
var hashPassword = function (password) {
  var saltRounds = 10;
  var salt = bcrypt.genSaltSync(saltRounds);
  var pwhash = bcrypt.hashSync(password, salt);
  return pwhash;
};

// Returns TRUE if a plaintext password is equivalent to a bcrypt password
// hash stored in the database.
var comparePassword = function(plaintext, pwhash) {
  return bcrypt.compareSync(plaintext, pwhash);
};

// Returns a promise that is resolved if the given email and password
// can be successfully validated against a user account, otherwise
// it is rejected.
var validatePassword = function (email, password) {
  return new Promise(function(resolve, reject) {
    database.users.getUserByEmail(email).then(function(user) {
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

// Returns a promise that is resolved if the proposed registration email/password
// meets the minimum standards.
var validateRegistrationPassword = function(password, confirmpassword) {
	return new Promise(function(resolve, reject) {
    if(!password || !confirmpassword) {
      reject('Missing password.');
    } else if (password.length < 4) {
      reject('Password too short (must contain at least 4 characters');
    } else if (password !== confirmpassword) {
      reject('Passwords do not match.');
    } else {
      resolve();
    }
  });
};

// Returns a promise that is resolved if the proposed email is available,
// and rejected if it is not.
var validateRegistrationEmail = function(email) {
  return new Promise(function(resolve, reject) {
    if (!email) {
      reject('Missing email.');
    } else {
      database.users.getUserByEmail(email).then(function() {
        reject("User '"+email+"' already exists");
      }).catch(function() {
        resolve();
      });
    }
  });
};

// Returns a middleware function that will *only* call next()
// if the user is authenticated.
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

// Returns a JSON Web Token (JWT) containing the given User ID.
var obtainJsonWebToken = function(userId) {
  var token = jwt.sign({ userId: userId }, config.authSecret);
  winston.debug("obtained json web token:", {token:token, decoded:jwt.decode(token)});
  return token;
};

// Returns the payload of the JSON Web Token (JWT).
//
// CAUTION: this DOES NOT verify the token to ensure authenticity.
// You must use verifyJsonWebToken() instead to verify the token.
var decodeJsonWebToken = function(token) {
	return jwt.decode(token);
};

// Verifies the given JSON Web Token (JWT) is valid and returns the
// User ID contained in it, otherwise returns FALSE.
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
module.exports.decodeJsonWebToken  = decodeJsonWebToken;
module.exports.verifyJsonWebToken = verifyJsonWebToken;
module.exports.configurePassport = configurePassport;
module.exports.hashPassword = hashPassword;
module.exports.comparePassword = comparePassword;
module.exports.validatePassword = validatePassword;
module.exports.validateRegistrationPassword = validateRegistrationPassword;
module.exports.validateRegistrationEmail = validateRegistrationEmail;
module.exports.ensureAuthenticated = ensureAuthenticated;
