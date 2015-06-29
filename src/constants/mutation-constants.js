import keymirror from 'keymirror'

const ActionConstants = keymirror({
  CREATE: null,
  CREATE_ERROR: null,
  CREATE_SUCCESS: null,
  DELETE: null,
  DELETE_ERROR: null,
  DELETE_SUCCESS: null,
  READ: null,
  READ_PROGRESS: null,
  READ_ERROR: null,
  READ_SUCCESS: null,
  UPDATE: null,
  UPDATE_ERROR: null,
  UPDATE_SUCCESS: null,
  FORM_TOGGLE_ACTIVE: null
})

export default ActionConstants
