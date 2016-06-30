var express = require('express');
var HealthService = require('../services/health');
var router = express.Router();

router.get('/', function(req, res) {
	var health = new HealthService();
	health.check().send(res, req.query.format);
});

module.exports = router;
