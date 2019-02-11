const path = require('path')
const exec = require('child_process').exec
const scriptPath = path.resolve(
  __dirname,
  `../requestReload.jsx`
)

class MyPlugin {
  constructor() {
    this.chunkVersions = {}
  }
  apply(compiler) {
    const sendReloadEvent = () => {
      console.log('Reload Requested')
      const command = `osascript -e 'tell application "Adobe After Effects CC 2019" to DoScriptFile "${scriptPath}"'`
      exec(command)
    }

    compiler.hooks.afterEmit.tapAsync(
      'ReloadExtensionsAfterCompilePlugin',
      (compilation, callback) => {
        var changedChunks = compilation.chunks.filter(
          chunk => {
            var oldVersion = this.chunkVersions[chunk.name]
            this.chunkVersions[chunk.name] = chunk.hash
            return chunk.hash !== oldVersion
          }
        )

        if (changedChunks.length > 0) {
          sendReloadEvent()
        }
        callback()
      }
    )
  }
}

module.exports = MyPlugin
