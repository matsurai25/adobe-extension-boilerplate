'use strict';
const gulp = require('gulp');
const fs = require('fs');
const del = require('del');
const exec = require('child_process').exec;
const prompt = require('prompt');
const colors = require('colors');
import config from '../../src/config.js';

const schema_certify = {
  properties: {
    countryCode: {
      description: 'Your Country Code (ex. JP, US)',
      pattern: /^\S+$/,
      message: 'Sorry, you cannot include white spaces.',
      default: 'JP',
    },
    stateOrProvince: {
      description: 'Your State or Province (ex. Tokyo, NY)',
      pattern: /^\S+$/,
      message: 'Sorry, you cannot include white spaces.',
      default: 'Tokyo',
    },
    organization: {
      description: 'Your organization (ex. MyCompany, AdobeJapan)',
      pattern: /^\S+$/,
      message: 'Sorry, you cannot include white spaces.',
      default: 'MyCompany',
    },
    commonName: {
      description: 'Your Name. (ex. AndyHall, matsurai25)',
      pattern: /^\S+$/,
      message: 'Sorry, you cannot include white spaces.',
      required: true,
    },
    password: {
      description: 'password (This password is required again when export)',
      pattern: /^\S+$/,
      message: 'Sorry, you cannot include white spaces.',
      hidden: true,
      replace: '*',
      required: true,
    }
  }
};
const schema_publish = {
  properties: {
    password: {
      description: `${config.name}.p12 password`,
      pattern: /^\S+$/,
      message: 'Sorry, you cannot include white spaces.',
      hidden: true,
      replace: '*',
      required: true,
    }
  }
};

// 書き出し
gulp.task('export', () => {
  // ZXPSignCmdの確認
  try {
    fs.statSync('./ZXPSignCmd');
  } catch (e) {
    console.log("ZXPSignCmd is not exist.\nPlease DL 'CC Extensions Signing Toolkit' and unzip, \nput ZXPSignCmd to current directly.".red);
    console.log("http://labs.adobe.com/downloads/extensionbuilder3.html".underline.red);
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
      exec(`./ZXPSignCmd -sign "./dist" ${config.name}.${config.version}.zxp ./${config.name}.p12 ${result.password}`);
      console.log(`${config.name}.${config.version}.zxp was created!!\n`.green);
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
