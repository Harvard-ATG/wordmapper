module.exports = {
	appName: process.env.APP_NAME || "Word Mapper",
	port: process.env.PORT || 8000,
	portSSL: process.env.PORT_SSL || 8443,
	logLevel: process.env.LOG_LEVEL || 'debug',
	database: process.env.DATABASE_URL || 'postgres://vagrant:vagrant@localhost:5432/wordmapper',
	authSecret: process.env.AUTH_SECRET || 'auth.secret',
	sessionSecret: process.env.SESSION_SECRET || 'session.secret'
};
