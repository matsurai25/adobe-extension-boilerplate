'use strict';
const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');

function handleError(err) {
  console.log(err.toString().red);
  this.emit('end');
}

gulp.task('build:js', () => {
  return browserify({
    entries: ['src/js/application.js']
  })
  .transform('babelify')
  .bundle()
  .on('error', handleError)
  .pipe(source('bundle.js')) // 出力ファイル名を指定
  .pipe(gulp.dest('dist/assets/js/'));
});
