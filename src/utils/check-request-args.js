/**
 * Checks the options arguments passed to a source when making a request
 * @param  {Object} options Argument to check
 * @param  {String} source  Source name
 * @return {Error|undefined} Returns an error if checks failed
 */
export default function checkRequestArgs (options = {}) {
  if (!options.ownerId) return new Error('Missing ownerId')

  /*eslint-disable no-fallthrough*/
  switch (options.collectionId) {
    case 'responses':
      if (!options.formId) return new Error('Missing formId')
    case 'forms':
      if (!options.storeId) return new Error('Missing storeId')
    case 'stores':
      if (!options.ownerId) return new Error('Missing ownerId')
      break
    default:
      return new Error('Invalid or undefined request type')
  }
  /*eslint-enable no-fallthrough*/
}
