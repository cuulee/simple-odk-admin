import React from 'react'
import { AppBar as MuiAppBar } from 'material-ui'

const style = {
  position: 'fixed',
  top: 0
}

class AppBar extends React.Component {
  render () {
    return (
      <MuiAppBar title={this.props.title} style={style} zDepth={2} />
    )
  }
}

AppBar.propTypes = {
  title: React.PropTypes.string
}

export default AppBar
