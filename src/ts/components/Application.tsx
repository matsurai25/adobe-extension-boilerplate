import * as React from 'react'
import * as classNames from 'classnames'
import * as styles from './Application.scss'
import {
  setBackgroundColor,
  applyReloadShortcut
} from '../util'
import * as jquery from 'jquery'

interface State {
  response: string
  message: string
}

class Application extends React.Component<{}, State> {
  private textarea = React.createRef<HTMLTextAreaElement>()

  constructor(props) {
    super(props)
    this.state = {
      response: '',
      message: ''
    }
  }

  componentDidMount() {
    // パネルの背景色を自動で合わせる
    // 即時実行するとエラーになるので、タイミングをずらしている
    setTimeout(setBackgroundColor, 0)

    // (開発用) トリプルクリックしたらリロードする
    applyReloadShortcut()

    jquery
      .ajax({
        url:
          'https://api.github.com/repos/Adobe-CEP/Getting-Started-guides'
      })
      .done(response => {
        // alert()
        this.setState({
          response: JSON.stringify(response, undefined, 2)
        })
      })
  }

  render() {
    const {
      handleClickSubmitButton,
      state: { response, message }
    } = this
    return (
      <div className={styles.wrapper}>
        <h1>🎉 React is mounted 🎉</h1>
        <p className={styles.note}>
          Now we can develop Extensions with TypeScript and
          React.
        </p>
        <h2>Ajax sample with jQuery</h2>
        <pre>{response}</pre>
        <h2>evalScript with CSInterface</h2>
        <div className={styles.actions}>
          <textarea
            ref={this.textarea}
            className={styles.input}
          >
            app.executeCommand(2000); 'createdComp: ' +
            app.project.activeItem.name
          </textarea>
          <button
            onClick={handleClickSubmitButton}
            className={styles.submit}
          >
            submit
          </button>
        </div>
        {message !== '' && <pre>{message}</pre>}
      </div>
    )
  }

  private handleClickSubmitButton = ev => {
    const script = this.textarea.current.value
    const { cs } = window
    cs.evalScript(script, message =>
      this.setState({ message })
    )
  }
}
export { Application as default }
