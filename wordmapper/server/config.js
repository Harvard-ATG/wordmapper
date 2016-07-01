var dbConfig = {
	host: 'localhost',
	port: 5432,
	database: 'wordmapper',
	username: 'ubuntu',
	password: 'ubuntu'
};

module.exports = {
	appName: "WordMapper",
	port: process.env.PORT || 8000,
	logLevel: process.env.LOG_LEVEL || 'debug',
	database: process.env.DATABASE_URL || dbConfig,
	authSecret: process.env.AUTH_SECRET || 'secret'
};
