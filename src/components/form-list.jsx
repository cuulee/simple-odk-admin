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
    const { dataLocal, ...other } = this.props

    const forms = dataLocal.get('collection')
    const awaitingUpdates = dataLocal.get('awaitingUpdates')

    const activeFormItems = forms.filter(form => form.get('active'))
      .map(form => <FormItem key={form.get('id')} {...other} data={form} />)

    const inactiveFormItems = forms.filter(form => !form.get('active'))
      .map(form => <FormItem key={form.get('id')} {...other} data={form} />)

    return (
      <div>
        {activeFormItems.length > 0 && (
          <div>
            <List subheader='Active Forms'>
              {activeFormItems}
            </List>
            <ListDivider />
          </div>
        )}
        {inactiveFormItems.length > 0 && (
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
        <List subheader='Create'>
          <FormItem name='New Form...' id='new' {...other} />
        </List>
        <ListDivider />
      </div>
    )
  }
}

FormList.propTypes = {
  dataLocal: ImmutablePropTypes.mapOf(
    ImmutablePropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      active: PropTypes.bool.isRequired
    })
  ),
  selectedId: PropTypes.string,
  createLink: PropTypes.func.isRequired
}

export default FormList
