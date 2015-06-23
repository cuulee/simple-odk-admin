import { EventEmitter } from 'events'
import Immutable from 'immutable'
import assign from 'object-assign'

import Dispatcher from './dispatcher'
import { MutationConstants } from './constants'
import Sources from './sources'

import Records from './records'

const CHANGE_EVENT = 'change'

// Make a hash of the sources we support
const supportedSources = Object.keys(Sources).reduce((sources, sourceId) => {
  sources[sourceId] = new Records.Source({
    id: sourceId
  })
}, {})

// Create initial state
const initialState = Immutable.Map(supportedSources)

const store = {
  dataLocal: initialState,
  dataRemote: initialState
}

function newDataFromServer (updates = []) {
  if (!Array.isArray(updates)) {
    updates = [ updates ]
  }
  _store.forms = _store.forms.withMutations(map => {
    updates.forEach(update => {
      if (map.has(update.id)) {
        map.set(update)
      } else {
        map.set(update.id, update)
      }
    })
  })
}

const Store = assign({}, EventEmitter.prototype, {
  getAllIn (searchKeyPath) {
    searchKeyPath.push('collection')
    return Store.getIn(searchKeyPath)
  },

  getIn (searchKeyPath) {
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
  case MutationConstants.READ:
    serverPending(action.payload.data)
    Store.emitChange()
    break

  case MutationConstants.READ_SUCCESS:
    newDataFromServer(action.payload.data)
    Store.emitChange()
    break

  default:
    // no op
  }
})

export default Store
