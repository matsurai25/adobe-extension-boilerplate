// ホストアプリケーションとの連携を行う
require('../../lib/CEP/CSInterface.js');

// 諸々ライブラリ読み込み
window.$ = require('jquery'); // 色々
window._ = require('underscore'); // js処理拡張
window.moment = require('moment'); // 日時を使いやすく

// 実行系ファイル読み込み
require('./module/**/*', {mode: 'expand'});

$(() => {
  window.CS = new CSinterface();
  window.init();
});
