var config = require('./config');
var bcrypt = require('bcrypt');

module.exports = {
	configureLogging: function(winston) {
		winston.setLevels({
			trace: 0,
			input: 1,
			verbose: 2,
			prompt: 3,
			debug: 4,
			info: 5,
			data: 6,
			help: 7,
			warn: 8,
			error: 9
		});

		winston.addColors({
			trace: 'magenta',
			input: 'grey',
			verbose: 'cyan',
			prompt: 'grey',
			debug: 'blue',
			info: 'green',
			data: 'grey',
			help: 'cyan',
			warn: 'yellow',
			error: 'red'
		});

		winston.remove(winston.transports.Console)
		winston.add(winston.transports.Console, {
			level: config.logLevel,
			prettyPrint: true,
			colorize: true,
			silent: false,
			timestamp: false
		});
		winston.level = config.logLevel;
	},
	ensureAuthenticated: function(valid, invalid) {
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
	},
	hashPassword: function(password) {
		var saltRounds = 10;
		var salt = bcrypt.genSaltSync(saltRounds);
		var pwhash = bcrypt.hashSync(password, salt);
		return pwhash;
	},
	comparePassword: function(plaintext, pwhash) {
		return bcrypt.compareSync(plaintext, pwhash);
	}
};
