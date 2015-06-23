import React from 'react'
import { FontIcon, Styles } from 'material-ui'
import m from 'xtend'

const style = {
  color: Styles.Colors.red300
}

class IconInactive extends React.Component {
  render () {
    return <FontIcon style={m(this.props.style, style)} className='material-icons'>block</FontIcon>
  }
}

IconInactive.propTypes = {
  style: React.PropTypes.object
}

export default IconInactive
