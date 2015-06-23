import sax from 'sax'

const MEDIA_REGEX = /^jr\:\/\/(?:images|audio|video)\/(.*)/i
const NAME_PATH = '/h:html/h:head/h:title'
const INSTANCE_PATH = '/h:html/h:head/model/instance'

/**
 * Parses an xform and returns a record:
 * ```js
 * {
 *   xformId: String // Form id from model instance
 *   name: String // Name from form Title tag
 *   media: Array // Array of any attached media
 *   version: Integer // Version number
 *   xml: String // original form xml
 * }
 * ```
 * @param  {String}   xform    Form xml as string
 * @param  {Function} callback
 */
export default function parseXform (xform, callback) {
  const strict = true
  const parser = sax.parser(strict)

  var path = ''

  const meta = {
    xformId: undefined,
    name: undefined,
    media: [],
    version: undefined,
    xml: xform
  }

  parser.onopentag = function (node) {
    var tagname = node.name
    var attrs = node.attributes
    if (path === INSTANCE_PATH && !meta.xformId) {
      meta.xformId = attrs.id || tagname
      if (attrs.version) meta.version = +attrs.version
    }
    path += '/' + tagname
  }

  parser.onclosetag = function (tagname) {
    var re = new RegExp('\/' + tagname + '$', 'i')
    path = path.replace(re, '')
  }

  parser.ontext = function (text) {
    if (path === NAME_PATH && !meta.name) {
      meta.name = text || 'Unnamed Form'
    }
    var media = text.match(MEDIA_REGEX)
    if (media) {
      meta.media.push(media[1])
    }
  }

  parser.onerror = function (err) {
    callback(err)
  }

  parser.onend = function () {
    callback(null, meta)
  }

  parser.write(xform).close()
}
