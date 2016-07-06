var express = require('express');
var log = require('winston');
var HealthService = require('../services/health');
var router = express.Router();

router.get('/', function(req, res) {
	var health = new HealthService();
	health.check().then(function() {
		log.info(health.toString());
		health.send(res, req.query.format);
	});
});

module.exports = router;
