import React from 'react'
import { FontIcon, Styles } from 'material-ui'
import m from 'xtend'

const style = {
  color: Styles.Colors.pinkA200
}

class IconNew extends React.Component {
  render () {
    return <FontIcon style={m(this.props.style, style)} className='material-icons'>add</FontIcon>
  }
}

IconNew.propTypes = {
  style: React.PropTypes.object
}

export default IconNew
