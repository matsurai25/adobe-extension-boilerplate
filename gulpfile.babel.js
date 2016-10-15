'use strict';
const gulp = require('gulp');
const requireDir = require('require-dir');
const sequence = require('run-sequence');

requireDir('lib/tasks', {recurse: true});

gulp.task('default', ['config-load'], () => {
  return sequence('build', 'watch');
});

gulp.task('watch', () => {
  gulp.watch(['src/**/*.jade'], () =>{ sequence('build:jade','copy'); });
  gulp.watch(['src/**/*.js'], () =>{ sequence('build:js','copy'); });
  gulp.watch(['src/**/*.scss'], () =>{ sequence('build:scss','copy'); });
});
