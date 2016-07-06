var config = require('./config');

module.exports = {
	configureLogging: function(winston) {
		winston.setLevels({
			trace: 4,
			debug: 3,
			info: 2,
			warn: 1,
			error: 0
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
	}
};
