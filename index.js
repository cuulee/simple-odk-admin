import 'babel/polyfill'
import React from 'react'
import { Router, Route } from 'react-router'
// histories are imported separately for smaller builds
import HashHistory from 'react-router/lib/HashHistory'

import App from './components/app'
import FormView from './components/form-view'

window.React = React

React.render((
  <Router history={new HashHistory()}>
    <Route path='/' component={App}>
      <Route path='forms/:id' component={FormView} />
    </Route>
  </Router>
), document.body)
