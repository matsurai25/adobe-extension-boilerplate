'use strict';
const gulp = require('gulp');
const fs = require('fs');
const del = require('del');
const exec = require('child_process').exec;
const prompt = require('prompt');
const colors = require('colors');
const CSON = require('cson');

// 書き出し
gulp.task('export',['config-load'], () => {

  const schema_certify = CSON.load(`lib/tasks/prompt_schema/certify.cson`);
  const schema_publish = CSON.load(`lib/tasks/prompt_schema/publish.cson`);

  // ZXPSignCmdの確認
  try {
    fs.statSync('./ZXPSignCmd');
  } catch (e) {
    console.log("ZXPSignCmd is not exist.\nPlease DL 'ZXPSignCMD' and\nput 'ZXPSignCmd' to current directly.".red);
    console.log("https://github.com/Adobe-CEP/CEP-Resources/tree/master/ZXPSignCMD".underline.red);
    return;
  }

  // 証明書がなければ発行モード
  let certification_exist_f = null;
  try {
    fs.statSync(`./${config.name}.p12`);
    certification_exist_f = true;
  } catch (e) {
    certification_exist_f = false;
  }

  let schema = null;
  let callback = null;
  if(!certification_exist_f){
    // certify & publish
    schema = schema_certify;
    callback = (result) => {
      return new Promise(function(resolve) {
        del(`./${config.name}.p12`);
        exec(`./ZXPSignCmd -selfSignedCert ${result.countryCode} ${result.stateOrProvince} ${result.organization} ${result.commonName} ${result.password} ./${config.name}.p12`,()=>{
          console.log(`${config.name}.p12 was created!!\n`.green);
          resolve();
        });
      }).then(() => {
        del(`${config.name}.${config.version}.zxp`);
        exec(`./ZXPSignCmd -sign "./dist" ${config.name}.${config.version}.zxp ./${config.name}.p12 ${result.password}`);
        console.log(`${config.name}.${config.version}.zxp was created!!\n`.green);
      });
    };

  }else{
    // publish only
    schema = schema_publish;
    callback = (result) => {
      del(`${config.name}.${config.version}.zxp`);
      exec(`./ZXPSignCmd -sign "./dist" ${config.name}.${config.version}.zxp ./${config.name}.p12 ${result.password}`,() => {
        try {
          fs.statSync(`${config.name}.${config.version}.zxp`);
          console.log(`${config.name}.${config.version}.zxp was created!!\n`.green);
          return;
        } catch (e) {
          console.log(`${config.name}.${config.version}.zxp was not created.\n Is it right password?`.red);
          return;
        }
      });
    };
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
  }).then(callback);
});
