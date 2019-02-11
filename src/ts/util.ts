import { HostEnvironment, RGBColor } from 'csinterface-ts'

export const setBackgroundColor = () => {
  const hostEnviroment = window.cs.getHostEnvironment() as HostEnvironment
  const color = hostEnviroment.appSkinInfo
    .panelBackgroundColor.color as RGBColor
  const hex = num => Math.floor(num).toString(16)
  document.bgColor = `#${hex(color.red)}${hex(
    color.green
  )}${hex(color.blue)}`
}

/**
 * 開発用: トリプルクリックしたらリロードする
 *
 * キーボードイベントが取得出来ないため、この方法で開発中のリロードを行う
 */
export const applyReloadShortcut = () => {
  var counter = 0
  window.addEventListener('click', ev => {
    counter++
    if (counter > 2) {
      location.reload()
    }
    setTimeout(() => counter--, 400)
  })
}

/**
 * 開発用: 特定のイベントがdispatchされたらリロードする
 *
 * $.sendEvent('request-reload-extension')
 */
export const applyReloadEventListener = () => {
  window.cs.addEventListener('request-reload-extension', () => location.reload())
}

/**
 * awaitするとsleepできる関数
 */
export function sleep(time: number) {
  return new Promise(r => setTimeout(r, time))
}
