var path = require('path');
var WebpackConfig = require('./webpack.config.js');

// Override the default entry point for the webpack bundle
// because each test file will act as an entry point instead.
// Note: must set to an empty object (null won't work).
WebpackConfig.entry = {};

// Remove jshint since we don't want to run jshint on the webpack generated code.
WebpackConfig.module.preLoaders = WebpackConfig.module.preLoaders.filter(function(preLoader) {
	if(preLoader.loader === 'jshint-loader') {
		return false;
	}
	return true
}); 

// Use Istanbul to instrument the source files we want to test against
// so that we get coverage data for just those files.
WebpackConfig.module.postLoaders = [{
	test: /\.js$/,
	include: path.resolve('wordmapper/client/src/js/'),
	loader: 'istanbul-instrumenter'
}];

module.exports = WebpackConfig;
