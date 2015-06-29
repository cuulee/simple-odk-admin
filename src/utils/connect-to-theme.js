import React from 'react'

export default function connectToStore (theme) {
  return function (Component) {
    class ThemeConnector extends React.Component {
      getChildContext () {
        return {
          muiTheme: theme
        }
      }

      render () {
        return <Component {...this.props} />
      }
    }

    ThemeConnector.childContextTypes = {
      muiTheme: React.PropTypes.object
    }

    return ThemeConnector
  }
}
