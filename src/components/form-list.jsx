import React, { PropTypes } from 'react'
import PureComponent from 'react-pure-render/component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { List, ListDivider } from 'material-ui'

import FormItem from './form-item'
import ProgressListItem from './progress-list-item'

/**
 * FormList receives a list of active forms and a list of inactive forms
 * and renders them together with a button for creating a new form.
 *
 * When a list item is clicked it will fire `this.props.clickHandler(id)`
 * where `id` is the id of the form item that is clicked ('new' if
 * 'New Form' is clicked)
 *
 * Any item whose id matches `selectedId` will be styled as selected.
 */
class FormList extends PureComponent {
  render () {
    const { activeForms, inactiveForms, awaitingUpdates, style, ...other } = this.props

    const activeFormItems = activeForms.map(form => {
      const formId = form.get('id')
      const name = form.getIn(['data', 'name'])
      return <FormItem key={formId} {...other} formId={formId} name={name} active={true} />
    })

    const inactiveFormItems = inactiveForms.map(form => {
      console.log(form.toJS())
      const formId = form.get('id')
      const name = form.getIn(['data', 'name'])
      return <FormItem key={formId} {...other} formId={formId} name={name} />
    })

    return (
      <div style={style}>
        {activeFormItems.count() > 0 && (
          <div>
            <List subheader='Active Forms'>
              {activeFormItems}
            </List>
            <ListDivider />
          </div>
        )}
        {inactiveFormItems.count() > 0 && (
          <div>
            <List subheader='Inactive Forms'>
              {inactiveFormItems}
            </List>
            <ListDivider />
          </div>
        )}
        {awaitingUpdates && (
          <List>
            <ProgressListItem />
          </List>
        )}
        {!awaitingUpdates && (
          <List subheader='Create'>
            <FormItem name='New Form...' formId='new' {...other} />
          </List>
        )}
        <ListDivider />
      </div>
    )
  }
}

FormList.propTypes = {
  activeForms: ImmutablePropTypes.map.isRequired,
  inactiveForms: ImmutablePropTypes.map.isRequired,
  selectedId: PropTypes.string,
  awaitingUpdates: PropTypes.bool,
  createLink: PropTypes.func.isRequired,
  style: PropTypes.object
}

export default FormList
