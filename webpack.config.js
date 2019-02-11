require('colors')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const Autoprefixer = require('autoprefixer')
const postcssCustomProperties = require('postcss-custom-properties')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const XMLWebpackPlugin = require('xml-webpack-plugin')

const path = require('path')
const configPath = path.resolve(
  __dirname,
  `./src/config.json`
)

let config = null
try {
  config = require(configPath)
} catch (e) {
  console.log('\n')
  console.log(`src/config.json is not exist.`.red)
  console.log(
    'Please run this command ` npm run config `'.red
  )
  console.log('\n\n')
  process.exit()
}

const HOME =
  process.env[
    process.platform == 'win32' ? 'USERPROFILE' : 'HOME'
  ]

// 今の所mac以外での動作は考慮していません。
var extensionsFolderPath = path.resolve(
  HOME,
  `./Library/Application Support/Adobe/CEP/extensions/` +
    config.name +
    '/'
)

console.log('\n')
console.log(extensionsFolderPath)
console.log('\n')

module.exports = {
  mode: 'development',
  // エントリーポイントの設定
  entry: './src/ts/index.ts',
  // 出力の設定
  output: {
    // 出力するファイル名
    filename: 'js/bundle.js',
    // 出力先のパス（v2系以降は絶対パスを指定する必要がある）
    path: path.join(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        // 拡張子 .ts もしくは .tsx の場合
        test: /\.tsx?$/,
        // TypeScript をコンパイルする
        use: 'ts-loader'
      },
      {
        test: /\.json$/,
        use: 'json-loader'
      },
      {
        test: /\.(jpg|jpeg|png|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'images'
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader?modules&localIdentName=[name]__[local]___[hash:base64:5]',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                Autoprefixer(),
                postcssCustomProperties()
              ]
            }
          },
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/bundle.css'
    }),
    new XMLWebpackPlugin({
      files: [
        {
          template: path.join(
            __dirname,
            'src/xml/manifest.ejs'
          ),
          filename: 'CSXS/manifest.xml',
          data: {
            bundleId: `${config.id}.${config.name}.${config.version}`,
            name: config.name
          }
        },
        {
          template: path.join(
            __dirname,
            'src/xml/debug.ejs'
          ),
          filename: '.debug',
          data: {
            bundleId: `${config.id}.${config.name}.${config.version}`,
            name: config.name
          }
        },
      ]
    }),
    new CopyWebpackPlugin(
      [
        {
          from: 'index.html',
          to: 'index.html'
        }
      ],
      { context: 'src' }
    ),
    new CopyWebpackPlugin(
      [
        {
          from: 'dist',
          to: extensionsFolderPath,
          dot: true
        },
      ],
    )
  ],
  // import 文で .ts や .tsx ファイルを解決するため
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.scss'],
    mainFiles: ['index']
  }
}
