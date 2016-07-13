var postgrator = require('postgrator');
var zpad = require('zpad');
var config = require('./config');

postgrator.setConfig({
    migrationDirectory: __dirname + '/migrations',
    schemaTable: 'schemaversion', 
    driver: 'pg', 
	connectionString: config.database
});

var version = (process.argv[2] || '').trim();
console.log("got version: ", version);
if(version === "" || (version !== "max" && isNaN(parseInt(version,10)))) {
	console.error("Must specify a migration version number or 'max' to migrate.");
	process.exit(1);
} else {
	version = zpad(version, 3);
}

postgrator.migrate(version, function (err, migrations) {
    if (err) {
        console.log(err)
    } else {
        console.log(migrations)
    }
    postgrator.endConnection(function () {
        // connection is closed, or will close in the case of SQL Server
    });
});
