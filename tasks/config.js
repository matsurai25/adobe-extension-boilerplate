const gulp = require('gulp');
const fs = require('fs');
const prompt = require('prompt');
const path = require('path');
const configPath = path.resolve(__dirname, `../src/config.json`)

gulp.task('config', async () => {
	let config = null;
	try {
		config = require(configPath);
	} catch (e) {
		console.log(`src/config.json is not exist.`.blue);
		return createconfig();
	}

	let schema = require(`./prompt/scheme-config`);

	// スキーマのデフォルト値を更新
	for (const key in schema.properties) {
		schema.properties[key].default = config[key];
	}

	return new Promise(resolve => {
		prompt.start();
		prompt.get(schema, (err, result) => {
			if (err) {
				console.log(`\n${err.message}\n`.red);
				return;
			}
			resolve(result);
		});
	}).then(result => {
		fs.writeFile(configPath, JSON.stringify(result, undefined, 2), err => {
			if (err) {
				return console.log(err);
			}
			global.config = result;
		});
		console.log(`🎉 config.json is successfully updated.`.green);
	});
});

var createconfig = () => {
	console.log(`To create config.json, please answer some question.`.blue);
	let schema = require(`./prompt/scheme-config`);
	return new Promise(resolve => {
		prompt.start();
		prompt.get(schema, (err, result) => {
			if (err) {
				console.log(`\n${err.message}\n`.red);
				return;
			}
			resolve(result);
		});
	}).then(result => {
		console.log(`🎉 config.json is successfully created.`.green);
		fs.writeFile(configPath, JSON.stringify(result, undefined, 2), err => {
			if (err) {
				return console.log(err);
			}
			global.config = result;
		});
	});
};
