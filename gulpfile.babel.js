'use strict';
const gulp = require('gulp');
const rename = require('gulp-rename');
const jade = require('gulp-jade');
const sass = require('gulp-sass');
const bulkSass = require('gulp-sass-bulk-import'); // scssをディレクトリ単位でimport
const plumber = require('gulp-plumber'); // エラーが起きてもtaskを停止しない
const browserify = require('browserify'); // jsの依存関係を解決
const source = require('vinyl-source-stream'); // browserifyで使用
const xeditor = require('gulp-xml-editor'); // xmlの編集
const exec = require('child_process').exec;
const prompt = require('prompt'); // 対話形式のコマンドを実現
const sequence = require('run-sequence'); // 実行順を指定できる
const path = require('path'); //パスをいい感じに
const fs = require('fs'); //ファイル操作
const colors = require('colors'); // 色つきの標準出力
const del = require('del'); // del

const HOME = process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];
// for mac
const CEP = `./Library/Application Support/Adobe/CEP/extensions/`;

import Config from './src/config.js';
const config = new Config();
gulp.task('default', () => {
  sequence('build', 'watch');
});

// 証明書発行
gulp.task('certify', () => {
  try {
    fs.statSync('./ZXPSignCmd');
  } catch (e) {
    console.log("ZXPSignCmd is not exist.\nPlease DL 'CC Extensions Signing Toolkit' and unzip, \nput ZXPSignCmd to current directly.".red);
    console.log("http://labs.adobe.com/downloads/extensionbuilder3.html".underline.red);
    return;
  }
  return new Promise(function(resolve, reject) {
    var schema = {
      properties: {
        countryCode: {
          description: 'Your Country Code (ex. JP, US)',
          pattern: /^\S+$/,
          message: 'Sorry, you cannot include white spaces.',
          default: 'JP',
        },
        stateOrProvince: {
          description: 'Your State or Province (ex. Tokyo, NY)',
          pattern: /^\S+$/,
          message: 'Sorry, you cannot include white spaces.',
          default: 'Tokyo',
        },
        organization: {
          description: 'Your organization (ex. MyCompany, AdobeJapan)',
          pattern: /^\S+$/,
          message: 'Sorry, you cannot include white spaces.',
          default: 'MyCompany',
        },
        commonName: {
          description: 'Your Name. (ex. AndyHall, matsurai25)',
          pattern: /^\S+$/,
          message: 'Sorry, you cannot include white spaces.',
          required: true,
        },
        password: {
          description: 'password (This password is required again when export)',
          pattern: /^\S+$/,
          message: 'Sorry, you cannot include white spaces.',
          hidden: true,
          replace: '*',
          required: true,
        }
      }
    };
    prompt.start();
    prompt.get(schema, function (err, result) {
      if(err){
        console.log(`\n${err.message}\n`.red);
        return;
      }
      resolve(result);
    });
  }).then((result) =>{
    del(`./${config.name}.p12`);
    exec(`./ZXPSignCmd -selfSignedCert ${result.countryCode} ${result.stateOrProvince} ${result.organization} ${result.commonName} ${result.password} ./${config.name}.p12`);
    console.log(`${config.name}.p12 was created!!\n`.green);
  });
});

// 書き出し
gulp.task('export', () => {
  try {
    fs.statSync('./ZXPSignCmd');
  } catch (e) {
    console.log("ZXPSignCmd is not exist.\nPlease DL 'CC Extensions Signing Toolkit' and unzip, \nput ZXPSignCmd to current directly.".red);
    console.log("http://labs.adobe.com/downloads/extensionbuilder3.html".underline.red);
    return;
  }
  // 証明書確認
  try {
    fs.statSync(`./${config.name}.p12`);
  } catch (e) {
    console.log(`./${config.name}.p12 is not exist.`.red);
    console.log("You have to run 'gulp certify' before 'gulp export'.\n".red);
    return;
  }
  return new Promise(function(resolve, reject) {
    var schema = {
      properties: {
        password: {
          description: `${config.name}.p12 password`,
          pattern: /^\S+$/,
          message: 'Sorry, you cannot include white spaces.',
          hidden: true,
          replace: '*',
          required: true,
        }
      }
    };
    prompt.start();
    prompt.get(schema, function (err, result) {
      if(err){
        console.log(`\n${err.message}\n`.red);
        return;
      }
      resolve(result);
    });
  }).then((result) =>{
    del(`${config.name}.${config.version}.zxp`);
    exec(`./ZXPSignCmd -sign "./dist" ${config.name}.${config.version}.zxp ./${config.name}.p12 ${result.password}`);
    console.log(`${config.name}.${config.version}.zxp was created!!\n`.green);
  });
});

// manifest.xmlの自動生成
gulp.task('build:xml', () => {
  return gulp.src("./src/xml/manifest.xml")
    .pipe(xeditor([
      {
        path: '//ExtensionManifest',
        attr: {
          'ExtensionBundleId': `${config.id}.${config.name}`,
          'ExtensionBundleVersion': config.version,
          'ExtensionBundleName': config.name,
        }
      },
      {
        path: '//ExtensionManifest/ExtensionList/Extension',
        attr: {
          'Id': `${config.id}.${config.name}.${config.version}`
        }
      },
      {
        path: '//ExtensionManifest/DispatchInfoList/Extension',
        attr: {
          'Id': `${config.id}.${config.name}.${config.version}`
        }
      },
      {
        path: '//ExtensionManifest/DispatchInfoList/Extension/DispatchInfo/UI/Menu',
        text: config.name
      }
    ]))
    .pipe(gulp.dest("./dist/CSXS/"));
});

// デバッグ用のextensionsフォルダ等にコピー
gulp.task('copyToCEP', () => {
  var CEP_path = path.resolve(HOME,CEP+config.name);
  return gulp.src('./dist/**/*')
    .pipe(gulp.dest(CEP_path));
});


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
  .pipe(gulp.dest(__dirname+'/dist/assets/js/'));
});

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
    .pipe(gulp.dest(__dirname+'/dist/assets/css/'));
});

gulp.task('build:jade', () => {
  return gulp.src(['src/jade/index.jade'])
    .pipe(plumber())
    .pipe(jade({
      basedir: __dirname+"/src/jade/",
      pretty: true
    }))
    .pipe(gulp.dest(__dirname+'/dist/'));
});

gulp.task('watch', () => {
  gulp.watch('src/**/*.jade', ['build:jade']);
  gulp.watch('src/**/*.scss', ['build:scss']);
  gulp.watch('src/**/*.js', ['build:js']);
  gulp.watch('src/**/*.xml', ['build:xml']);
  gulp.watch('dist/**/*', ['copyToCEP']);
});

gulp.task('build', () => {
  return sequence('build:scss', 'build:js', 'build:jade', 'build:xml', 'copyToCEP');
});
