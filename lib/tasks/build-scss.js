'use strict';
const gulp = require('gulp');
const sass = require('gulp-sass');
const bulkSass = require('gulp-sass-bulk-import');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');

gulp.task('build:scss', () => {
  return gulp.src('src/scss/application.scss')
    .pipe(plumber({
      errorHandler: function(err){
        console.log(err.messageFormatted);
      }
    }))
    .pipe(bulkSass())
    .pipe(sass())
    .pipe(rename("bundle.css"))
    .pipe(gulp.dest('dist/assets/css/'));
});
