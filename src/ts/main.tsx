import './global.scss'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Application from './components/Application'

try {
  ReactDOM.render(
    <Application />,
    document.getElementById('mountpoint')
  )
} catch (error) {
  alert(error)
}
