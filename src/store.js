import { EventEmitter } from 'events'
import Immutable from 'immutable'
import assign from 'object-assign'

import Dispatcher from './dispatcher'
import { ActionConstants } from './constants'
import Sources from './sources'

import Records from './records'

const CHANGE_EVENT = 'change'

// Make a hash of the sources we support
// const supportedSources = Object.keys(Sources).reduce((sources, sourceId) => {
//   sources[sourceId] = new Records.Source({
//     id: sourceId
//   })
//   return sources
// }, {})

const defaultForm = new Records.Form({
  id: 'forms/monitoring/form.xml'
})

const defaultStore = new Records.Store({
  id: 'digidem/sample-monitoring-data',
  forms: new Records.Collection({
    collection: Immutable.Map({
      'forms/monitoring/form.xml': defaultForm
    })
  })
})

const defaultSource = new Records.Source({
  id: 'github',
  stores: new Records.Collection({
    collection: Immutable.Map({
      'digidem/sample-monitoring-data': defaultStore
    })
  })
})

// Create initial state
const initialState = Immutable.Map({
  github: defaultSource
})

const store = {
  dataLocal: initialState,
  dataRemote: initialState
}

function readPending (payload) {
  const keyPath = Records.createKeyPath(payload)
  keyPath.splice(-1, 1, 'awaitingUpdates')
  store.dataLocal = store.dataLocal.setIn(keyPath, true)
  Store.emitChange()
}

function createOrUpdate (payload) {
  const keyPath = Records.createKeyPath(payload)
  const newRecord = Records.createRecord(payload)
  store.dataLocal = store.dataLocal.mergeDeepIn(keyPath, newRecord)
  store.dataRemote = store.dataRemote.mergeDeepIn(keyPath, newRecord)
  Store.emitChange()
}

function readComplete (payload) {
  const keyPath = Records.createKeyPath(payload)
  keyPath.splice(-1, 1, 'awaitingUpdates')
  store.dataLocal = store.dataLocal.setIn(keyPath, false)
  Store.emitChange()
}

function toggleFormActive (payload) {
  const keyPath = Records.createKeyPath(payload).concat('data', 'active')
  console.log(keyPath)
  store.dataLocal = store.dataLocal.updateIn(keyPath, v => !v)
  Store.emitChange()
}

const Store = assign({}, EventEmitter.prototype, {
  get (options) {
    const searchKeyPath = Records.createKeyPath(options)
    return {
      dataLocal: store.dataLocal.getIn(searchKeyPath),
      dataRemote: store.dataRemote.getIn(searchKeyPath)
    }
  },

  getState () {
    return store
  },

  emitChange () {
    this.emit(CHANGE_EVENT)
  },

  /**
   * @param {function} callback
   */
  addChangeListener (callback) {
    this.on(CHANGE_EVENT, callback)
  },

  /**
   * @param {function} callback
   */
  removeChangeListener (callback) {
    this.removeListener(CHANGE_EVENT, callback)
  }
})

// Register callback to handle all updates
Dispatcher.register(function (action) {
  switch (action.type) {
  case ActionConstants.READ:
    readPending(action.payload)
    break

  case ActionConstants.READ_PROGRESS:
    createOrUpdate(action.payload)
    break

  case ActionConstants.READ_SUCCESS:
    readComplete(action.payload)
    break

  case ActionConstants.FORM_TOGGLE_ACTIVE:
    toggleFormActive(action.payload)
    break

  default:
    // no op
  }
})

export default Store
