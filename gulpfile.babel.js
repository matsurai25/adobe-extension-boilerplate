'use strict';
const gulp = require('gulp');
const requireDir = require('require-dir');
const sequence = require('run-sequence'); // 実行順を指定できる
const colors = require('colors'); // 色つきの標準出力

requireDir('lib/tasks', {recurse: true});

gulp.task('default', () => {
  return sequence('build', 'watch');
});

gulp.task('watch', () => {
  gulp.watch(['src/**/*.jade'], () =>{ sequence('build:jade','copy'); });
  gulp.watch(['src/**/*.js'], () =>{ sequence('build:js','copy'); });
  gulp.watch(['src/**/*.scss'], () =>{ sequence('build:scss','copy'); });
});
