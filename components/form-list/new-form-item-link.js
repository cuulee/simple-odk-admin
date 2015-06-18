import React from 'react'
import { ListItem } from 'material-ui'
import IconNew from './icon-new'

class NewFormItem extends React.Component {
  render () {
    return (
      <ListItem leftIcon={<IconNew />}>
        New Form...
      </ListItem>
    )
  }
}

export default NewFormItem
