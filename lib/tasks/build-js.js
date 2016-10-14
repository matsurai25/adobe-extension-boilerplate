'use strict';
const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');

gulp.task('build:js', () => {
  return browserify({
    entries: ['src/js/application.js']
  })
  .transform('require-globify')
  .transform('babelify')
  .bundle()
  .on('error', (e) => {
    console.log(e.message);
    console.log(e.stack);
  })
  .pipe(source('bundle.js')) // 出力ファイル名を指定
  .pipe(gulp.dest('dist/assets/js/'));
});
