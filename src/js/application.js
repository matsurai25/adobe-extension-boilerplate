// ホストアプリケーションとの連携を行う
window.CSInterface = require('../../lib/CEP/CSInterface.js');
// パネルの背景色を管理
const themeManager = require('../../lib/CEP/themeManager.js');

// 開始
themeManager.init(); // パネルの背景色を自動で合わせる
require('./module/init.js')(); // 処理の開始
