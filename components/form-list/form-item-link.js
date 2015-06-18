import React from 'react'
import { Styles, Utils } from 'material-ui'
import ListItemLink from './list-item-link'
import IconActive from './icon-active'
import IconInactive from './icon-inactive'

const styles = {
  inactive: {
    color: Utils.ColorManipulator.fade(Styles.Colors.darkBlack, 0.3)
  },
  activeRoute: {
    backgroundColor: Styles.Colors.grey300
  }
}

class FormItemLink extends React.Component {
  render () {
    const icon = this.props.formIsActive ? <IconActive /> : <IconInactive />
    const style = this.props.formIsActive ? {} : styles.inactive
    return (
      <ListItemLink
        leftIcon={icon}
        style={style}
        activeStyle={styles.activeRoute}
        to={this.props.to}
      >
        {this.props.name}
      </ListItemLink>
    )
  }
}

FormItemLink.propTypes = {
  formIsActive: React.PropTypes.bool,
  name: React.PropTypes.string.isRequired,
  to: React.PropTypes.string.isRequired
}

// Make router available on context
FormItemLink.contextTypes = {
  router: React.PropTypes.object
}

export default FormItemLink
