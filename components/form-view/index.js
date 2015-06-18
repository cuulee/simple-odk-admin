import React from 'react'
import { Paper } from 'material-ui'

const style = {
  margin: 8,
  padding: 16,
  minHeight: 300
}

class FormView extends React.Component {
  render () {
    return (
      <Paper style={style}>{this.props.params.id}</Paper>
    )
  }
}

export default FormView
