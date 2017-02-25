# adobe-html5-panel-template
AdobeAfterEffectsでいい感じにHTML5パネルを作るときにまとめといたもの。  
とりあえずmacのみ

### 使い方
#### `npm start`
開発の開始。
開発中のアプリをCEPフォルダに自動的に追加する。

#### `npm run export`
zxpを出力する。
出力用の設定をダイアログで行う。

#### `npm run config`
ダイアログ形式で設定ファイルを変更できる。

### 開発の流れ
#### 導入
* git clone
* (rm -r .git)
* npm install
* npm run config

#### 開発
* npm startでコンパイルとwatchを行う。
* 開発はデフォルトでjade/scss/ES6が使えるようにしてある。coffeeだったり他のものが使いたい場合は随時gulpファイルを編集すること。
* AdobeAfterEffectsの拡張機能の欄に自動的に現在開発中の項目が出る。
* 更新した場合は一度パネルを閉じてまた開く必要がある(今後自動化したい)
* 対象AEのバージョンなどはmanifest.xmlで定義する(今後自動化したい)
* パネルを開いた状態でhttp://localhost:8088にアクセスすると開発者ツールが見れる

#### 配布
* npm run export

