'use strict';
const gulp = require('gulp');
const sequence = require('run-sequence'); // 実行順を指定できる

gulp.task('build', () => {
  return sequence('build:scss', 'build:js', 'build:xml', 'copy');
});
