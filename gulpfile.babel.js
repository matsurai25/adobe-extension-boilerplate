'use strict';
const gulp = require('gulp');
const rename = require('gulp-rename');
const jade = require('gulp-jade');
const sass = require('gulp-sass');
const bulkSass = require('gulp-sass-bulk-import'); // scssをディレクトリ単位でimport
const plumber = require('gulp-plumber'); // エラーが起きてもtaskを停止しない
const browserify = require('browserify'); // jsの依存関係を解決
const babelify = require('babelify'); // ES6を使用可能に
const source = require('vinyl-source-stream'); // browserifyで使用
const xeditor = require('gulp-xml-editor'); // xmlの編集
// const underscore = require('underscore'); // js処理拡張
// const moment = require('moment'); // 日時を使いやすく
// const vue = require('vue'); // データバインディング
// const shell = require('gulp-shell'); // シェルを実行可能に
// const del      = require('del'); // ディレクトリごと削除するライブラリ
// const sequence = require('run-sequence'); // 実行順を指定できる
// const minimist = require('minimist'); // コマンドの引数を受け取る
// const config = require('./config.js');

import ManifestConfig from './lib/manifest_config';
const manifestConfig = new ManifestConfig();
gulp.task('default', ['build', 'watch']);

// AdobeHTML5専用コマンド
// 証明書発行
// TODO: 証明書発行手続きの勉強、発行処理の自動化

// manifest.xmlの自動生成
gulp.task('build:xml', function(){
  gulp.src("./src/xml/manifest.xml")
    .pipe(xeditor([
      {
        path: '//ExtensionManifest',
        attr: {
          'ExtensionBundleId': manifestConfig.bundleId,
          'ExtensionBundleVersion': manifestConfig.version,
          'ExtensionBundleName': manifestConfig.name,
        }
      },
      {
        path: '//ExtensionManifest/ExtensionList/Extension',
        attr: {
          'Id': manifestConfig.extensionId
        }
      },
      {
        path: '//ExtensionManifest/DispatchInfoList/Extension',
        attr: {
          'Id': manifestConfig.extensionId
        }
      },
      {
        path: '//ExtensionManifest/DispatchInfoList/Extension/DispatchInfo/UI/Menu',
        text: manifestConfig.name
      }
    ]))
    .pipe(gulp.dest("./dist/CSXS/"));
});

// デバッグ用のscriptUIフォルダ等にコピー


gulp.task('build:js', function(){
  browserify({
    entries: ['src/js/application.js']
  })
  .transform(babelify)
  .bundle()
  .on('error',function(e){
    console.log(e);
    this.emit('end');
  })
  .pipe(source('bundle.js')) // 出力ファイル名を指定
  .pipe(gulp.dest(__dirname+'/dist/assets/js/'));
});

gulp.task('build:scss', function(){
  gulp.src('src/scss/application.scss')
    .pipe(plumber({
      errorHandler: function(err){
        console.log(err.messageFormatted);
        this.emit('end');
      }
    }))
    .pipe(bulkSass())
    .pipe(sass())
    .pipe(rename("bundle.css"))
    .pipe(gulp.dest(__dirname+'/dist/assets/css/'));
});

gulp.task('build:jade', function(){
  gulp.src(['src/jade/index.jade'])
    .pipe(plumber())
    .pipe(jade({
      basedir: __dirname+"/src/jade/",
      pretty: true
    }))
    .pipe(gulp.dest(__dirname+'/dist/'));
});

gulp.task('watch', function(){
  gulp.watch('src/**/*.jade', ['build:jade']);
  gulp.watch('src/**/*.scss', ['build:scss']);
  gulp.watch('src/**/*.js', ['build:js']);
  gulp.watch('src/**/*.xml', ['build:xml']);
});

gulp.task('build', [
  'build:scss',
  'build:js',
  'build:jade',
  'build:xml'
]);
