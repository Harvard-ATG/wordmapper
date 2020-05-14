const path = require('path');
const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
	mode: NODE_ENV,
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		compress: true,
		port: 8000
	},
	entry: path.resolve(__dirname, 'src/app.js'),
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bookmarklet.js'
	},
	resolve: {
		alias: {
			jquery: path.resolve('vendor/jquery-1.12.4.min.js'),
			logging: path.resolve(__dirname, 'src/js/logging'),
			config: path.join(__dirname, 'config', NODE_ENV)
		}
	},
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.html$/i,
				loader: "underscore-template-loader",
				// options for the loader
				query: {
					engine: 'lodash',
					prependFilenameComment: __dirname
				}
			}
		]
	}
};
