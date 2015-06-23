import React from 'react'
import { CircularProgress, ListItem } from 'material-ui'

class ProgressListItem extends React.Component {
  render () {
    return (
      <ListItem>
        <CircularProgress mode='indeterminate' />
      </ListItem>
    )
  }
}

export default ProgressListItem
