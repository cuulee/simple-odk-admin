import Dispatcher from '../dispatcher'
import { ActionConstants, AsyncTaskConstants } from '../constants'
import sources from '../sources'
import checkArgs from '../utils/check-request-args'
import Queue from '../utils/queue'
import { Request, createKeyPath, getIdKey } from '../records'

const q = new Queue(makeRequest)

function makeRequest (request, callback) {
  let error = checkArgs(request)
  if (error) return callback(error)

  const source = sources[request.sourceId]
  if (!source) {
    return callback('Invalid or missing sourceId')
  }

  switch (request.type) {
  case AsyncTaskConstants.GET:
    source.get(request, callback)
    break
  case AsyncTaskConstants.LIST:
    source.list(request, callback)
    break
  case AsyncTaskConstants.UPDATE:
    break
  default:
    throw new Error('invalid or missing request type')
  }
}

function fetch (options = {}) {
  const request = new Request(options)

  if (request.collectionId) {
    Dispatcher.dispatch({
      type: ActionConstants.READ,
      payload: request
    })
    let listRequest = request.set('type', AsyncTaskConstants.LIST)
    q.add(listRequest.toJS(), getAll)
  } else {
    let id = createKeyPath(request).pop()
    getAll(null, [id])
  }

  function getAll (err, ids) {
    if (err) return fetchError(request, err)
    const idKey = getIdKey(request)

    let count = ids.length
    ids.slice(0,20).forEach(id => {
      const getRequest = request.set('type', AsyncTaskConstants.GET).set(idKey, id)
      q.add(getRequest.toJS(), (err, record) => {
        if (err) return fetchError(getRequest, err)
        fetchProgress(getRequest, record)
        count--
        if (count === 0) fetchSuccess(request)
      })
    })
  }
}

function fetchProgress (request, data) {
  Dispatcher.dispatch({
    type: ActionConstants.READ_PROGRESS,
    payload: request.set('data', data)
  })
}

function fetchSuccess (request) {
  Dispatcher.dispatch({
    type: ActionConstants.READ_SUCCESS,
    payload: request
  })
}

function fetchError (request, error) {
  Dispatcher.dispatch({
    type: ActionConstants.READ_ERROR,
    payload: request.set('error', error)
  })
}

export default { fetch }
