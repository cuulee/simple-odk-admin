import Octokat from 'octokat'
import parseXform from '../utils/parse-xform'

// The folder in the github repo where forms are stored
const FORMS_PATH = 'forms'
// The folder in the github repo where inactive forms are stored
const INACTIVE_FORMS_PATH = 'inactive-forms'
// Regex to check if a path in a git tree is a form
const FORM_REGEX = new RegExp(`^(${FORMS_PATH}|${INACTIVE_FORMS_PATH}).*\.xml$`)
// The folder containing form responses
const RESPONSE_FOLDER = 'submissions'
// Regex to check folder and match form ID
const RESPONSE_REGEX = new RegExp(`^${RESPONSE_FOLDER}/(.*)/(.*)\.geojson`)

/**
 * Returns a list of ids of items in a collection.
 * @param  {Object}   options
 * @param {String} options.type One of `stores|forms|media|responses`
 * @param {String} options.ownerId
 * @param {String} options.storeId
 * @param {String} options.formId
 * @param  {Function} callback callback(error, ids) where ids is an array of ids
 */
function list (options, callback) {
  switch (options.collectionId) {
    case 'forms':
      return _getList(options, FORM_REGEX, callback)
    case 'responses':
      return _getList(options, RESPONSE_REGEX, callback)
    default:
      callback(new Error('No method yet for ' + options.type))
  }
}

/**
 * Returns a single item from a collection.
 * @param  {Object}   options
 * @param {String} options.type One of `stores|forms|media|responses`
 * @param {String} options.id Required - id of resource to get
 * @param {String} options.ownerId
 * @param {String} options.storeId
 * @param {String} options.formId
 * @param  {Function} callback callback(error, response) where response is an object
 */
function get (options, callback) {
  switch (options.collectionId) {
    case 'forms':
      return _getForm(options, callback)
    case 'responses':
      return _getResponse(options, callback)
    default:
      callback(new Error('No method yet for ' + options.type))
  }
}

/**
 * Matches any paths within a github repo against `FORM_REGEX`
 * and returns a list of paths
 * @private
 */
function _getList (options = {}, folderRe, callback) {
  const branch = options.branch || 'master'
  const octo = new Octokat({ token: options.authToken })
  const repo = octo.repos(options.ownerId, options.storeId)

  repo.git.trees(branch + '?recursive=1').fetch((err, res) => {
    if (err) return callback(err)
    const paths = res.tree
      .filter(item => folderRe.test(item.path))
      .map(item => item.path)
    callback(null, paths)
  })
}

/**
 * Retrieves a single form from the github repo with `path = options.id`
 * @param  {[type]}   options  [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function _getForm (options, callback) {
  const params = options.branch ? '?ref=' + options.branch : ''
  const octo = new Octokat({ token: options.authToken })
  const repo = octo.repos(options.ownerId, options.storeId)
  const id = options.formId

  repo.contents(id + params).read((err, xform) => {
    if (err) return callback(err)
    parseXform(xform, (err, form) => {
      if (err) return callback(err)
      form.id = id
      form.xml = xform
      if (id.indexOf(FORMS_PATH) === 0) {
        form.active = true
      } else if (id.indexOd(INACTIVE_FORMS_PATH) === 0) {
        form.active = false
      } else {
        callback(new Error('This is not a valid form'))
      }
      callback(null, form)
    })
  })
}

/**
 * Retrieves a single form from the github repo with `path = options.id`
 * @param  {[type]}   options  [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function _getResponse (options, callback) {
  const params = options.branch ? '?ref=' + options.branch : ''
  const octo = new Octokat({ token: options.authToken })
  const repo = octo.repos(options.ownerId, options.storeId)
  const id = options.responseId

  repo.contents(id + params).read((err, response) => {
    if (err) return callback(err)
    callback(null, JSON.parse(response))
  })
}

export default { list, get }
