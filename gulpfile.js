var gulp = require('gulp');
var webpack = require('webpack-stream');

gulp.task('webpack', function() {
  return gulp.src('wordmapper/client/src/app.js')
    .pipe(webpack({
        //watch: true,
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

gulp.task('copyBookmarklet', ['webpack'], function() {
   return gulp.src('wordmapper/client/dist/bookmarklet.js')
      .pipe(gulp.dest('wordmapper/server/public/js/'));
});

gulp.task('build', ['webpack', 'copyBookmarklet']);

gulp.task('default', ['build']);
