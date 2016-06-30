var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	res.send('hooray! welcome to our admin interface!')
});

module.exports = router;
