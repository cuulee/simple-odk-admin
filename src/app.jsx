import React from 'react'
import { Styles } from 'material-ui'

import { AppBar, FormView, FormList, OfflineComponent } from './components'
import Store from './store'
import connectToStore from './utils/connect-to-store'
import connectToTheme from './utils/connect-to-theme'
import { createKeyPath } from './records'

const ThemeManager = new Styles.ThemeManager()

const AppBarHeight = ThemeManager.getCurrentTheme().component.appBar.height

const styles = {
  wrapper: {
    marginTop: AppBarHeight,
    padding: 8,
    position: 'relative'
  },
  formList: {
    width: 312,
    height: '100%',
    position: 'fixed'
  },
  formViewWrapper: {
    marginLeft: 320,
    position: 'relative'
  }
}

@connectToTheme(ThemeManager.getCurrentTheme())
@connectToStore(Store)
class App extends OfflineComponent {
  createLink (id) {
    const { sourceId, ownerId, storeId } = this.props.params
    return `/${sourceId}/${ownerId}/${storeId}/forms/${encodeURIComponent(id)}`
  }

  render () {
    const formId = decodeURIComponent(this.props.params.formId)
    const forms = this.getInLocal(createKeyPath({
      sourceId: 'github',
      ownerId: 'digidem',
      storeId: 'sample-monitoring-data',
      collectionId: 'forms'
    }))
    const activeForms = forms.filter(form => {
      return form.getIn(['data', 'active'])
    })
    const inactiveForms = forms.filter(form => {
      return !form.getIn(['data', 'active'], true)
    })
    if (formId) {
      let keyPath = createKeyPath({
        sourceId: 'github',
        ownerId: 'digidem',
        storeId: 'sample-monitoring-data',
        formId: formId
      })
      var form = this.getInLocalRemote(keyPath)
    }
    return (
      <div>
        <AppBar key='asd' title='ODK Form Manager' />
        <div style={styles.wrapper}>
          {forms && (
            <FormList
              style={styles.formList}
              activeForms={activeForms}
              inactiveForms={inactiveForms}
              createLink={this.createLink.bind(this)}
              selectedId={formId}
              />
          )}
          <div style={styles.formViewWrapper}>
            {form.dataLocal && <FormView {...form} params={this.props.params} />}
          </div>
        </div>
      </div>
    )
  }
}

App.propTypes = {
  FormList: React.PropTypes.element,
  params: React.PropTypes.object
}

export default App
