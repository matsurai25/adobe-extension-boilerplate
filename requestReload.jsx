;(function() {
  if (typeof $.sendEvent != 'undefined') {
    return
  }
  var xLib
  try {
    xLib = new ExternalObject('lib:PlugPlugExternalObject')
  } catch (e) {
    alert('Missing ExternalObject: ' + e)
  }

  // ツールVMからカスタムイベントを発送
  $.sendEvent = function(type) {
    if (xLib) {
      var eventObj = new CSXSEvent()
      eventObj.type = type
      eventObj.data = app.toString()
      eventObj.dispatch()
    }
  }
})()
$.sendEvent('request-reload-extension')
