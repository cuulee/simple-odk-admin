import React, { PropTypes } from 'react'
import PureComponent from 'react-pure-render/component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { ListItem, Styles, Utils } from 'material-ui'
import { Link } from 'react-router'
import assign from 'object-assign'

import { IconActive, IconInactive, IconNew } from './icons'

const styles = {
  base: {},
  inactive: {
    color: Utils.ColorManipulator.fade(Styles.Colors.darkBlack, 0.3)
  },
  selected: {
    backgroundColor: Styles.Colors.grey300
  },
  ellipsis: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  }
}

class FormItem extends PureComponent {
  render () {
    const { selectedId, createLink, formId, name, active } = this.props

    let icon
    let style = assign({}, styles.base)
    // Choose an icon and style depending on whether the form is
    // active or not, or if this is a button to create a new form
    if (formId === 'new') {
      icon = <IconNew />
    } else if (active) {
      icon = <IconActive />
    } else {
      icon = <IconInactive />
      style = styles.inactive
    }

    // If this item is currently selected, override style
    if (selectedId === formId) {
      style = assign({}, style, styles.selected)
    }

    return (
      <ListItem
        leftIcon={icon}
        style={style}
        containerElement={<Link to={createLink(formId)} />}
        title={name}
      >
        <div style={styles.ellipsis}>{name}</div>
      </ListItem>
    )
  }
}

FormItem.propTypes = {
  selectedId: PropTypes.string.isRequired,
  createLink: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  formId: PropTypes.string.isRequired,
  active: PropTypes.bool
}

export default FormItem
