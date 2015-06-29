/**
 * Simple ODK Admin has a simple heirarchical structure:
 *
 *  +------------+
 *  |   Source   |
 *  +-----+------+
 *        |
 *        |
 *  +-----v------+
 *  |   Store    |
 *  +-----+------+
 *        |
 *        |
 *  +-----v------+
 *  |   Form     |
 *  +-----+------+
 *        |
 *        |
 *  +-----v------+
 *  |  Response  |
 *  +------------+
 *
 * The complete data structure is immutable. Any pending reads from the server
 * are indicated by a `pendingRead` property on each collection. A pending write
 * is indicated by `pendingWrites` which is an array of keys which are being
 * updated. If the whole record is being updated the array contains ['$ALL'].
 * The `error` property indicates an error reading or writing data to the server.
 *
 * This means that the application state can be restored at any time, and any
 * pending server operations can be resumed.
 *
 */

import { Record, Map } from 'immutable'
import assign from 'object-assign'

/**
 * All Records share these base attributes.
 *
 * @property {string} id - Identifies the object
 * @property {string|Error} [error] - Error message from async op
 * @property {string} [version] - If versioning is implemented, should increment/change every update
 */
const BaseRecord = function (defaultValues) {
  return Record(assign({
      id: undefined,
      error: undefined,
      version: undefined
    }, defaultValues))
}

/**
 * All collections of records have a `awaitingUpdates` attribute that
 * indicates that updates have been requested from the server. This allows
 * the UI to show a progress indicator as items download.
 *
 * @type {Record}
 */
const Collection = Record({
  collection: Map(),
  awaitingUpdates: false
})

/**
 * A source is a store provider that contains one or more form stores.
 * Simple ODK is designed to be agnostic about where data is stored,
 * A new source needs to implement the methods `list` and `get` for
 * both forms and responses.
 *
 * @property {Map} stores - A collection of Store Records
 * @property {string} type - Always 'source' for a Source
 *
 * @type {Record}
 */
const Source = BaseRecord({
  stores: new Collection(),
  type: 'source'
})

/**
 * A Store is like a database. In the case of Github it is a repo. We also
 * use a gist as a store. A store contains a collection of different forms
 * and responses.
 *
 * @property {Map} forms - A collection of Form Records
 * @property {string} type - Always 'store' for a Store
 *
 * @type {Record}
 */
const Store = BaseRecord({
  forms: new Collection(),
  type: 'store'
})

const FormData = Record({
  xformId: undefined,
  name: 'Unnamed Form',
  xformVersion: 1,
  active: true,
  xml: undefined
})

/**
 * A form represents an ODK xForm. It contains a list of responses, and
 * a list of any media used by the form i.e. images used for questions.
 * It is optionally versioned for immutable structures on the server e.g.
 * for Github the version is the sha hash.
 *
 * @property {Map} responses - A collection of Response Records
 * @property {Map} media - A collection of Media Records
 * @property {FormData} data - A Record containing the form metadata
 * @property {string} type - Always 'form' for a Form
 *
 * @type {[type]}
 */
const Form = BaseRecord({
  responses: new Collection(),
  media: new Collection(),
  data: new FormData(),
  type: 'form'
})

const Media = Record({
  filename: undefined,
  type: 'media'
})

const Response = BaseRecord({
  media: new Collection(),
  data: {},
  type: 'response'
})

/**
 * We manage a log of all pending requests to the server. `type` is one of
 * 'CREATE', 'READ', 'UPDATE', 'DELETE'. `collectionId` is one of 'sources',
 * 'stores', 'forms', 'media', 'responses'
 *
 * @type {Record}
 */
const Request = Record({
  sourceId: undefined,
  ownerId: undefined,
  storeId: undefined,
  formId: undefined,
  mediaId: undefined,
  responseId: undefined,
  collectionId: undefined,
  authToken: undefined,
  data: {},
  type: undefined,
  error: undefined
})

/**
 * createKeyPath creates an array keyPath that can be used to get or set deep values
 * in an Immutable (see http://facebook.github.io/immutable-js/docs/#/List/setIn)
 * If `collectionId` is set then the keypath will point to a Map or records, rather
 * than a record value.
 *
 * @param  {Request} request - A request record.
 * @return {array}          a keyPath array
 */
function createKeyPath (request = new Request()) {
  const keyPath = []
  const { sourceId, ownerId, storeId, formId, responseId, mediaId, collectionId } = request
  const fullStoreId = ownerId + '/' + storeId

  if (responseId) {
    keyPath.unshift(responseId)
  }

  if (mediaId) {
    keyPath.unshift(mediaId)
  }

  if (formId) {
    if (collectionId === 'responses' || responseId) keyPath.unshift('responses', 'collection')
    if (collectionId === 'media' || mediaId) keyPath.unshift('media', 'collection')
    keyPath.unshift(formId)
  }

  if (fullStoreId) {
    if (collectionId === 'forms' || formId) keyPath.unshift('forms', 'collection')
    keyPath.unshift(fullStoreId)
  }

  if (sourceId) {
    if (collectionId === 'stores' || fullStoreId) keyPath.unshift('stores', 'collection')
    keyPath.unshift(sourceId)
  }

  if (!sourceId && collectionId !== 'sources') {
    throw new Error('invalid request')
  }

  return keyPath
}

function getIdKey (request = new Request()) {
  const { sourceId, storeId, formId, mediaId, responseId, collectionId } = request

  if (responseId || collectionId === 'responses') return 'responseId'
  if (mediaId || collectionId === 'media') return 'mediaId'
  if (formId || collectionId === 'forms') return 'formId'
  if (storeId || collectionId === 'stores') return 'storeId'
  if (sourceId || collectionId === 'sources') return 'sourceId'
}

function createRecord (request = new Request()) {
  const { sourceId, storeId, formId, mediaId, responseId, data } = request
  if (!data) throw new Error('no data to create new record')
  if (responseId) return new Response({ data })
  if (mediaId) return new Media(data)
  if (formId) {
    return new Form({
      id: data.id,
      data: new FormData(data)
    })
  }
}

export default {
  Collection,
  Source,
  Store,
  Form,
  FormData,
  Media,
  Response,
  Request,
  createKeyPath,
  getIdKey,
  createRecord
}
