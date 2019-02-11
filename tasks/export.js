'use strict'
require('colors')
const gulp = require('gulp')
const fs = require('fs')
const del = require('del')
const exec = require('child_process').exec
const prompt = require('prompt')
const path = require('path')
const configPath = path.resolve(
  __dirname,
  `../src/config.json`
)
const ZXPSignCmdPath = path.resolve(
  __dirname,
  `../ZXPSignCmd`
)

// 書き出し
gulp.task('export', async () => {
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
    return
  }

  const schemaCertify = require(`./prompt/scheme-certify`)
  const schemaPublish = require(`./prompt/scheme-publish`)

  // ZXPSignCmdの確認
  try {
    fs.statSync(ZXPSignCmdPath)
  } catch (e) {
    console.log('\n\n')
    console.log(
      'ZXPSignCmd is not exist.\nPlease Download ZXPSignCMD and put here.'
        .red
    )
    console.log(ZXPSignCmdPath.red)
    console.log('\n')
    console.log(
      'You can download ZXPSignCMD from here.\nhttps://github.com/Adobe-CEP/CEP-Resources/tree/master/ZXPSignCMD'
    )
    console.log('\n\n')
    return
  }

  // 証明書がなければ発行モード
  let isCertificationExists = null
  try {
    fs.statSync(`./${config.name}.p12`)
    isCertificationExists = true
  } catch (e) {
    isCertificationExists = false
  }

  let schema = null
  let callback = null
  if (!isCertificationExists) {
    // certify & publish
    schema = schemaCertify
    callback = result => {
      return new Promise(function(resolve) {
        del(`./${config.name}.p12`)
        exec(
          `./ZXPSignCmd -selfSignedCert ${
            result.countryCode
          } ${result.stateOrProvince} ${
            result.organization
          } ${result.commonName} ${result.password} ./${
            config.name
          }.p12`,
          () => {
            console.log(
              `🎉 ${config.name}.p12 was created.\n`.green
            )
            resolve()
          }
        )
      }).then(() => {
        del(`${config.name}.${config.version}.zxp`)
        exec(
          `./ZXPSignCmd -sign "./dist" ${config.name}.${
            config.version
          }.zxp ./${config.name}.p12 ${result.password}`
        )
        console.log(
          `🎉 ${config.name}.${
            config.version
          }.zxp was created!\n`.green
        )
      })
    }
  } else {
    // publish only
    schema = schemaPublish
    callback = result => {
      del(`${config.name}.${config.version}.zxp`)
      exec(
        `./ZXPSignCmd -sign "./dist" ${config.name}.${
          config.version
        }.zxp ./${config.name}.p12 ${result.password}`,
        () => {
          try {
            fs.statSync(
              `${config.name}.${config.version}.zxp`
            )
            console.log(
              `🎉 ${config.name}.${
                config.version
              }.zxp was created!\n`.green
            )
            return
          } catch (e) {
            console.log(
              `${config.name}.${
                config.version
              }.zxp was not created.\n Is it right password?`
                .red
            )
            return
          }
        }
      )
    }
  }

  return new Promise(function(resolve) {
    prompt.start()
    prompt.get(schema, function(err, result) {
      if (err) {
        console.log(`\n${err.message}\n`.red)
        return
      }
      resolve(result)
    })
  }).then(callback)
})
