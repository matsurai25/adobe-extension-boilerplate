'use strict';
const gulp = require('gulp');
const fs = require('fs');
const CSON = require('cson');
const prompt = require('prompt');

const config_path = `src/config.cson`;
// デバッグ用のextensionsフォルダ等にコピー
gulp.task('config-load', (callback) => {
  try {
    fs.statSync(config_path);
  } catch (e) {
    console.log(`config.cson is not exist.`.blue);
    return createconfig();
  }
  console.log(`load: config.cson`.green);
  global.config = CSON.load(config_path);
  callback();
});

gulp.task('config-edit', (callback) => {
  try {
    fs.statSync(config_path);
  } catch (e) {
    console.log(`config.cson is not exist.`.blue);
    return createconfig();
  }
  let config = CSON.load(config_path);
  let schema = CSON.load(`lib/tasks/prompt_schema/config-create.cson`);
  for (var key in schema.properties) {
    schema.properties[key].default = config[key];
  }
  return new Promise(function(resolve) {
    prompt.start();
    prompt.get(schema, function (err, result) {
      if(err){
        console.log(`\n${err.message}\n`.red);
        return;
      }
      resolve(result);
    });
  }).then( (result) => {
    console.log(`create: config.cson`.green);
    fs.writeFile(config_path, CSON.stringify(result), function(err) {
        if(err) {
            return console.log(err);
        }
        global.config = result;
    });
  });
});


var createconfig = () => {
  console.log(`To create config.cson, please answer some question.`.blue);
  let schema = CSON.load(`lib/tasks/prompt_schema/config-create.cson`);
  return new Promise(function(resolve) {
    prompt.start();
    prompt.get(schema, function (err, result) {
      if(err){
        console.log(`\n${err.message}\n`.red);
        return;
      }
      resolve(result);
    });
  }).then( (result) => {
    console.log(`create: config.cson`.green);
    fs.writeFile(config_path, CSON.stringify(result), function(err) {
        if(err) {
            return console.log(err);
        }
        global.config = result;
    });
  });
};
