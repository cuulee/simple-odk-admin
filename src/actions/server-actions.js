import assign from 'object-assign'

import Dispatcher from '../dispatcher'
import { MutationConstants, AsyncTaskConstants } from '../constants'
import sources from '../sources'
import checkArgs from '../utils/check-request-args'
import Queue from '../utils/queue'
import stringify from 'json-stable-stringify'

const q = new Queue(request)

function request (task, callback) {
  task = JSON.parse(task)
  let error = checkArgs(task)
  if (error) return callback(error)

  const source = sources[task.sourceId]
  if (!source) {
    return callback('Invalid or missing sourceId')
  }

  switch (task.type) {
  case AsyncTaskConstants.GET:
    source.get(task, callback)
    break
  case AsyncTaskConstants.LIST:
    source.list(task, callback)
    break
  default:
    // no-op
  }
}

function fetch (options = {}) {
  Dispatcher.dispatch({
    type: MutationConstants.READ,
    payload: assign({}, options)
  })

  var task = stringify(options)

  q.add(task, (err, ids) => {
    if (err) return fetchError(options, err)
    let count = ids.length
    ids.forEach(id => {
      const getOptions = assign({}, options, { id })
      q.add(getOptions, (err, response) => {
        if (err) return fetchError(getOptions, err)
        fetchSuccess(getOptions, response)
        count--
        if (count === 0) fetchSuccess(options)
      })
    })
  })
}

function fetchSuccess (reqOptions, data) {
  const payload = assign({}, reqOptions)
  payload.data = data

  Dispatcher.dispatch({
    type: MutationConstants.READ_SUCCESS,
    payload: payload
  })
}

function fetchError (reqOptions, err) {
  const payload = assign({}, reqOptions)
  payload.err = err

  Dispatcher.dispatch({
    type: MutationConstants.READ_ERROR,
    payload: payload
  })
}

export default { fetch, fetchSuccess, fetchError }
