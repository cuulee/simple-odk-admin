import React from 'react'
import { Router, Route, Redirect } from 'react-router'
// histories are imported separately for smaller builds
import HashHistory from 'react-router/lib/HashHistory'

import App from './app'
import { FormList, FormView } from './components'

const basePath = ':sourceId/:ownerId/:storeId'

export default (
  <Router history={new HashHistory()}>
    <Route component={App}>
      <Redirect from={basePath} to={basePath + '/forms'} />
      <Route path={basePath + '/forms'} components={{FormList: FormList}} >
        <Route path=':formId' components={{FormView: FormView}} />
      </Route>
    </Route>
  </Router>
)
