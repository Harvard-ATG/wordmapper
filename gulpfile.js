var gulp = require('gulp');
var webpack = require('webpack-stream');

gulp.task('webpack', function() {
  return gulp.src('wordmapper/client/src/app.js')
    .pipe(webpack({
        output: {
            filename: 'bookmarklet.js'
        },
        module: {
          loaders: [
            { test: /\.css$/, loader: 'style!css' },
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

gulp.task('watch', function() {
  var watcher = gulp.watch('wordmapper/client/src/**/*', ['build']);
  watcher.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
  return watcher;
});

gulp.task('default', ['build']);
