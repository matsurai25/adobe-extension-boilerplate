'use strict';
const gulp = require('gulp');
const jade = require('gulp-jade');
const plumber = require('gulp-plumber');

gulp.task('build:jade', () => {
  return gulp.src(['src/jade/index.jade'])
    .pipe(plumber())
    .pipe(jade({
      basedir: "src/jade/",
      pretty: true
    }))
    .pipe(gulp.dest('dist/'));
});
