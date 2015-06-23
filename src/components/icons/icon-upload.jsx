import React from 'react'
import { FontIcon, Styles } from 'material-ui'
import m from 'xtend'

const style = {
  color: Styles.Colors.grey400
}

class IconUpload extends React.Component {
  render () {
    return <FontIcon style={m(this.props.style, style)} className='material-icons'>file_upload</FontIcon>
  }
}

IconUpload.propTypes = {
  style: React.PropTypes.object
}

export default IconUpload
