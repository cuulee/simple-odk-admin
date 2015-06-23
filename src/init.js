import React from 'react'
import Routes from './routes'
import { ServerActions } from './actions'
import Dispatcher from './dispatcher'

window.React = React

Dispatcher.register((payload) =>
  console.log(payload)
)

ServerActions.fetch({
  sourceId: 'github',
  ownerId: 'digidem',
  storeId: 'sample-monitoring-data',
  type: 'forms',
  authToken: 'af0b713a3de61fc1b571ef3c11103f1e937c62f8'
})

ServerActions.fetch({
  sourceId: 'github',
  ownerId: 'digidem',
  storeId: 'sample-monitoring-data',
  formId: 'monitoring',
  type: 'responses',
  authToken: 'af0b713a3de61fc1b571ef3c11103f1e937c62f8'
})

React.render(Routes, document.getElementById('app'))

