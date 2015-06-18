import React from 'react'
import { Styles } from 'material-ui'
import FormList from './form-list'
import AppBar from './app-bar'

const ThemeManager = new Styles.ThemeManager()

const props = {
  forms: {
    active: [
      {
        id: 12,
        name: 'Monitoring'
      }, {
        id: 13,
        name: 'Birds'
      }, {
        id: 14,
        name: 'Logging'
      }
    ],
    inactive: [
      {
        id: 15,
        name: 'Test Form'
      }, {
        id: 16,
        name: 'Mining'
      }
    ]
  }
}

const styles = {
  wrapper: {
    padding: 8,
    marginTop: ThemeManager.getCurrentTheme().component.appBar.height
  },
  formList: {
    width: 216,
    float: 'left'
  },
  formView: {
    marginLeft: 216
  }
}

class App extends React.Component {
  getChildContext () {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    }
  }

  render () {
    return (
      <div>
        <AppBar title='ODK Form Manager' />
        <div style={styles.wrapper}>
          <div style={styles.formList}>
            <FormList {...props} />
          </div>
          <div style={styles.formView}>
            {React.Children.map(this.props.children, (child) => React.addons.cloneWithProps(child))}
          </div>
        </div>
      </div>
    )
  }
}

App.propTypes = {
  children: React.PropTypes.element
}

App.childContextTypes = {
  muiTheme: React.PropTypes.object
}

export default App
