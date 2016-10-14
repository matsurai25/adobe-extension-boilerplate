'use strict';
const gulp = require('gulp');
const path = require('path'); // パスをいい感じに
const HOME = process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];
// for mac
const CEP = `./Library/Application Support/Adobe/CEP/extensions/`;
import config from '../../src/config.js';

// デバッグ用のextensionsフォルダ等にコピー
gulp.task('copy', () => {
  var CEP_path = path.resolve(HOME,CEP+config.name);
  return gulp.src('dist/**/*')
    .pipe(gulp.dest(CEP_path));
});
