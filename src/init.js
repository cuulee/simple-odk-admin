import React from 'react'
import Routes from './routes'
import { ServerActions } from './actions'
import Dispatcher from './dispatcher'
import { githubToken } from '../config'

window.React = React

Dispatcher.register((payload) =>
  console.log(payload)
)

ServerActions.fetch({
  sourceId: 'github',
  ownerId: 'digidem',
  storeId: 'sample-monitoring-data',
  collectionId: 'forms',
  authToken: githubToken
})

ServerActions.fetch({
  sourceId: 'github',
  ownerId: 'digidem',
  storeId: 'sample-monitoring-data',
  formId: 'forms/monitoring/form.xml',
  collectionId: 'responses',
  authToken: githubToken
})

React.render(Routes, document.getElementById('app'))

