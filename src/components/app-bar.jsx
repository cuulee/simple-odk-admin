import React, { PropTypes } from 'react'
import PureComponent from 'react-pure-render/component'
import { AppBar as MuiAppBar } from 'material-ui'

const style = {
  position: 'fixed',
  top: 0
}

class AppBar extends PureComponent {
  render () {
    return (
      <MuiAppBar title={this.props.title} style={style} zDepth={2} />
    )
  }
}

AppBar.propTypes = {
  title: PropTypes.string
}

export default AppBar
