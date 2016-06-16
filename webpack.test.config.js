var WebpackConfig = require('./webpack.config.js');

WebpackConfig.module.postLoaders.push({
	test: /\.js$/,
	include: path.resolve('wordmapper/client/src/'),
	loader: 'instanbul-instrumenter'
});

module.exports = WebpackConfig
