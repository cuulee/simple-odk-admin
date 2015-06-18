import React from 'react'
import { FontIcon, Styles } from 'material-ui'
import m from 'xtend'

const style = {
  color: Styles.Colors.lime500
}

class IconActive extends React.Component {
  render () {
    return <FontIcon style={m(this.props.style, style)} className='material-icons'>done</FontIcon>
  }
}

IconActive.propTypes = {
  style: React.PropTypes.object
}

export default IconActive
