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
	database: process.env.DATABASE_URL || dbConfig,
	logLevel: process.env.LOG_LEVEL || 'debug'
};
