var pgUrl = require('pg-database-url');

var dbConfig = {
	host: 'localhost',
	port: 5432,
	database: 'wordmapper',
	username: 'vagrant', // ubuntu
	password: 'vagrant' // ubuntu
};
var dbUrl = pgUrl(dbConfig);

module.exports = {
	appName: "WordMapper",
	port: process.env.PORT || 8000,
	logLevel: process.env.LOG_LEVEL || 'debug',
	database: process.env.DATABASE_URL || dbUrl,
	authSecret: process.env.AUTH_SECRET || 'auth.secret',
	sessionSecret: process.env.SESSION_SECRET || 'session.secret'
};
