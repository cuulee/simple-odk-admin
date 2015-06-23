import keymirror from 'keymirror'

const MutationConstants = keymirror({
  CREATE: null,
  CREATE_ERROR: null,
  CREATE_SUCCESS: null,
  DELETE: null,
  DELETE_ERROR: null,
  DELETE_SUCCESS: null,
  READ: null,
  READ_ERROR: null,
  READ_SUCCESS: null,
  UPDATE: null,
  UPDATE_ERROR: null,
  UPDATE_SUCCESS: null
})

export default MutationConstants
