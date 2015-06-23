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
    }))
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
 * 'CREATE', 'READ', 'UPDATE', 'DELETE'.
 *
 * @type {Record}
 */
const Request = Record({
  sourceId: undefined,
  storeId: undefined,
  formId: undefined,
  mediaId: undefined,
  responseId: undefined,
  data: {},
  type: undefined
})

function createKeyPath (obj) {
  const keyPath = []
  const keys = [ 'sourceId', 'storeId', 'formId', 'responseId', 'mediaId' ]

  keys.forEach(key => {
    if (obj[key]) keyPath.push(obj[key])
  })

  return keyPath
}

export default {
  Source,
  Store,
  Form,
  FormData,
  Media,
  Response,
  Request,
  createKeyPath
}
