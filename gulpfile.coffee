gulp         = require 'gulp'
rename       = require 'gulp-rename'
jade         = require 'gulp-jade' # jadeのコンパイル
coffee       = require 'gulp-coffee' # coffeeのコンパイル
sass         = require 'gulp-sass' # SASSのコンパイル
plumber      = require 'gulp-plumber' # エラーが起きてもtaskを停止しない
shell        = require 'gulp-shell' # シェルを実行可能に
browserify   = require 'browserify' # 依存関係を解決
source       = require 'vinyl-source-stream' # browserifyで使用
xeditor      = require 'gulp-xml-editor' # xmlの編集
packagejson  = require './package.json'

# 変数
ExtensionBundleVersion = packagejson.version
ExtensionBundleName = packagejson.name
ExtensionBundleId = "info.matsurai25" + "." + ExtensionBundleName
ExtensionId = ExtensionBundleId + "." + ExtensionBundleName


gulp.task 'default', ['build', 'watch']

# AdobeHTML5専用コマンド
# 証明書発行

# manifest.xmlの自動生成
gulp.task 'build:xml', ->
  gulp.src("./src/_default/manifest.xml")
    .pipe(xeditor([
      {path: '//ExtensionManifest', attr: {
        'ExtensionBundleId': ExtensionBundleId
        'ExtensionBundleVersion': ExtensionBundleVersion
        'ExtensionBundleName': ExtensionBundleName
      }}
      {path: '//ExtensionManifest/ExtensionList/Extension', attr: {
        'Id': ExtensionId
      }}
      {path: '//ExtensionManifest/DispatchInfoList/Extension', attr: {
        'Id': ExtensionId
      }}
      {path: '//ExtensionManifest/DispatchInfoList/Extension/DispatchInfo/UI/Menu', text: ExtensionBundleName}
    ]))
    .pipe(gulp.dest("./dist/CSXS/"))

# デバッグ用フォルダにコピー


gulp.task 'build:coffee', ->
  browserify
    entries: ['src/coffee/main.coffee']
    extensions: ['.coffee'] # CoffeeScriptも使えるように
  .bundle()
  .pipe source 'bundle.js' # 出力ファイル名を指定
  .pipe gulp.dest __dirname+'/dist/assets/js/'

gulp.task 'build:scss', ->
  gulp.src('src/scss/application.scss')
    .pipe(plumber({
      errorHandler: (err) ->
        console.log(err.messageFormatted)
        this.emit('end')
    }))
    .pipe(sass())
    .pipe(rename("bundle.css"))
    .pipe gulp.dest __dirname+'/dist/assets/css/'

gulp.task 'build:jade', ->
  gulp.src(['src/jade/index.jade'])
    .pipe(plumber())
    .pipe(jade({
      basedir: __dirname+"/src/jade/"
      pretty: true
    }))
    .pipe gulp.dest __dirname+'/dist/'

gulp.task 'watch', ->
  gulp.watch 'src/**/*.jade', ['build:jade']
  gulp.watch 'src/**/*.scss', ['build:scss']
  gulp.watch 'src/**/*.coffee', ['build:coffee']
  gulp.watch 'src/**/*.xml', ['build:xml']

gulp.task 'build', [
  'build:scss'
  'build:coffee'
  'build:jade'
  'build:xml'
]
