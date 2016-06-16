/**
 * Gulp Tasks
 * --------------------------------------------------------------------
 *
 * USAGE:
 * 
 *    $ gulp build -- Build the JS using webpack
 *    $ gulp watch -- Watch the JS files and automatically rebuild (via webpack).
 *    $ gulp test -- Run the JS unit tests
 *
 * NOTES:
 * -The default task when you execute "gulp" without any arguments is to build the JS.
 */

var path = require('path');
var gulp = require('gulp');
var webpack = require('webpack-stream');
var KarmaServer = require('karma').Server;


gulp.task('webpack', function() {
  return gulp.src('wordmapper/client/src/app.js')
    .pipe(webpack({
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
    }))
    .pipe(gulp.dest('wordmapper/client/dist/'));
});

gulp.task('copy', ['webpack'], function() {
  return gulp.src('wordmapper/client/dist/bookmarklet.js')
    .pipe(gulp.dest('wordmapper/server/public/js/'));
});

gulp.task('build', ['webpack', 'copy']);

gulp.task('test', function (done) {
  // This is equivalent to: karma start karma.conf.js --single-run
  new KarmaServer({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('watch', function() {
  var watcher = gulp.watch('wordmapper/client/src/**/*', ['build']);
  watcher.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
  return watcher;
});

gulp.task('default', ['build']);
