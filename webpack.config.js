var path = require('path');
var NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
	entry: path.resolve('wordmapper/client/src/app.js'),
	files: [],
	preprocessors: {},
	output: {
		filename: 'app.js'
	},
	resolve: {
		alias: {
			jquery: path.resolve('wordmapper/client/vendor/jquery-1.12.4.min.js'),
			logging: path.resolve(__dirname, 'wordmapper/client/src/js/logging'),
			config: path.join(__dirname, 'wordmapper/client/config', NODE_ENV)
		}
	},
	module: {
		preLoaders: [
			{
				test: /\.js$/,
				include: [path.resolve('wordmapper/client/src')],
				loader: 'jshint-loader'
			}
		],
		loaders: [
			{
				test: /\.css$/,
				loader: 'style!css'
			},
			{
				test: /\.html$/,
				loader: "underscore-template-loader",
				query: {
					engine: 'lodash',
					prependFilenameComment: __dirname
				}
			}
		],
		postLoaders: []
	},
};
