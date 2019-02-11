// 'use strict';
// const gulp = require('gulp');
// const path = require('path');
// const configPath = path.resolve(__dirname, `../src/config.json`)

// // 今の所mac以外での動作は考慮していません。
// const HOME = process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME'];
// const CEP = `./Library/Application Support/Adobe/CEP/extensions/`;

// // デバッグ用のextensionsフォルダ等にコピー
// gulp.task('copy', () => {
// 	let config = null;
// 	try {
// 		config = require(configPath)
// 	} catch (e) {
// 		console.log("\n")
// 		console.log(`src/config.json is not exist.`.red);
// 		console.log('Please run this command ` npm run config `'.red)
// 		console.log("\n")
// 		console.log("\n")
// 		process.exit()
// 	}

// 	const extensionsFolderPath = path.resolve(
// 		HOME,
// 		`./Library/Application Support/Adobe/CEP/extensions/` +
// 			config.name + config.version
// 	)
		
// 	return gulp.src(['dist/**/*', 'dist/.debug']).pipe(gulp.dest(extensionsFolderPath));
// });
