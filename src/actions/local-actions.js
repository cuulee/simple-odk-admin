import Dispatcher from '../dispatcher'
import { ActionConstants } from '../constants'

function toggleActive (options) {
  Dispatcher.dispatch({
    type: ActionConstants.FORM_TOGGLE_ACTIVE,
    payload: options
  })
}

export default {
  toggleActive
}
