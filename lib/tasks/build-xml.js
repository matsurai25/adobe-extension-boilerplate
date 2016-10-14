'use strict';
const gulp = require('gulp');
const xeditor = require('gulp-xml-editor'); // xmlの編集
import config from '../../src/config.js';

// manifest.xmlの自動生成
gulp.task('build:xml', () => {
  return gulp.src("src/xml/manifest.xml")
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
});
