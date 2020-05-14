/**
 * Gulp Tasks
 *    $ gulp build -- Build the JS using webpack
 *    $ gulp watch -- Watch the JS client files and automatically rebuild (via webpack).
 */

const path = require('path');
const gulp = require('gulp');
const webpack = require('webpack-stream');

const build = function() {
	const config = require(path.resolve('webpack.config.js'));
	return gulp.src('src/app.js')
		.pipe(webpack(config))
		.pipe(gulp.dest('dist/'));
}

const watch = function() {
	return gulp.watch('src/**/*', function(path, stats) {
		console.log(`File ${path} was changed`);
		build();
	});
}

module.exports = { default: build, build, watch };
