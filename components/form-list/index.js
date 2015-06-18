import React from 'react'
import { List, ListDivider } from 'material-ui'
import FormItemLink from './form-item-link'
import NewFormItemLink from './new-form-item-link'

class FormList extends React.Component {
  render () {
    const activeFormItems = this.props.forms.active
      .map(form => <FormItemLink key={form.name} to={`/forms/${form.id}`} formIsActive={true} {...form} />)

    const inactiveFormItems = this.props.forms.inactive
      .map(form => <FormItemLink key={form.name} to={`/forms/${form.id}`} formIsActive={false} {...form} />)

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
        <List subheader='Create'>
          <NewFormItemLink to='/forms/new' />
        </List>
        <ListDivider />
      </div>
    )
  }
}

FormList.propTypes = {
  forms: React.PropTypes.object.isRequired,
  style: React.PropTypes.object
}

FormList.childContextTypes = {
  muiTheme: React.PropTypes.object
}

export default FormList
