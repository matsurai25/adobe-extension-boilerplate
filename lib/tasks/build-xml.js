'use strict';
const gulp = require('gulp');
const xeditor = require('gulp-xml-editor'); // xmlの編集

// manifest.xmlの自動生成
gulp.task('build:xml', () => {
  gulp.src("src/xml/manifest.xml")
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
    .pipe(gulp.dest("dist/CSXS/"));

  gulp.src("src/xml/.debug")
    .pipe(xeditor([
      {
        path: '//ExtensionList/Extension',
        attr: {
          'Id': `${config.id}.${config.name}.${config.version}`,
        }
      }
    ]))
    .pipe(gulp.dest("dist/"));
});
