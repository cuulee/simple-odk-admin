import React from 'react'
import { Styles } from 'material-ui'

import { AppBar } from './components'
// import { ServerActions } from './actions'
import Store from './store'
import connectToStore from './utils/connect-to-store'

const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup

const ThemeManager = new Styles.ThemeManager()

const AppBarHeight = ThemeManager.getCurrentTheme().component.appBar.height

const styles = {
  FormList: {
    width: 312,
    float: 'left',
    marginLeft: 8,
    marginTop: AppBarHeight + 8
  },
  FormView: {
    marginLeft: 320,
    marginTop: AppBarHeight + 8,
    position: 'relative'
  }
}

class App extends React.Component {
  getChildContext () {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    }
  }

  createLink (id) {
    const { sourceId, ownerId, storeId } = this.props.params
    return `/${sourceId}/${ownerId}/${storeId}/forms/${encodeURIComponent(id)}`
  }

  render () {
    const store = this.props.store
    const FormList = this.props.FormList
    const FormView = FormList && FormList.props.FormView
    const formId = encodeURIComponent(this.props.params.formId)
    const forms = store.getAllIn(['github', 'digidem-test', 'sample-monitoring-data'])
    const form = store.getIn(['github', 'digidem-test', 'sample-monitoring-data', formId])
    return (
      <div>
        <AppBar title='ODK Form Manager' />
        { FormList && React.addons.cloneWithProps(FormList, {
          style: styles.FormList,
          dataLocal: forms.dataLocal,
          remoteData: forms.dataRemote,
          createLink: this.createLink.bind(this)
        }) }
        <ReactCSSTransitionGroup transitionName='example' transitionAppear={true}>
          { FormView && React.addons.cloneWithProps(FormView, {
            key: formId,
            style: styles.FormView,
            dataLocal: form.dataLocal,
            dataRemote: form.dataRemote
          }) }
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}

App.propTypes = {
  FormList: React.PropTypes.element,
  params: React.PropTypes.object
}

App.childContextTypes = {
  muiTheme: React.PropTypes.object
}

export default connectToStore(App, Store)
