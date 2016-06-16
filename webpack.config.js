var path = require('path');
module.exports = {
	output: {
		filename: 'bookmarklet.js'
	},
	resolve: {
		alias: {
			jquery: path.resolve('wordmapper/client/vendor/jquery-1.12.4.min.js')
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
	},
};
