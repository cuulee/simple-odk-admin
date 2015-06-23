import React, { PropTypes } from 'react'
import PureComponent from 'react-pure-render/component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Card, CardTitle, List, ListItem,
  Toggle, ListDivider, RaisedButton } from 'material-ui'

import { IconActive, IconInactive, IconUpload } from './icons'

const styles = {
  card: {
    maxWidth: 640,
    margin: '8px auto',
    paddingLeft: 8,
    paddingRight: 8
  },
  uploadButton: {
    marginRight: 8
  }
}

class FormView extends PureComponent {
  render () {
    var { dataLocal } = this.props
    return (
      <Card style={styles.card}>
        <CardTitle
          title={dataLocal.get('name')}
          subtitle={'Version ' + dataLocal.get('version')}
          />
        <List>
          <ListItem
            leftIcon={<IconUpload />}
            disableTouchTap={true}
            secondaryText={<p>Select a Form XML file or drag and drop here</p>}
            rightIconButton={<RaisedButton style={styles.uploadButton} label='Select Form XML' />}
            >
            Upload New Version the Form
          </ListItem>
          <ListItem
            leftIcon={dataLocal.get('active') ? <IconActive /> : <IconInactive />}
            rightToggle={<Toggle />}
            secondaryText={<p>Only active forms can be downloaded in ODK Collect</p>}
            >
            { dataLocal.get('active') ? 'Active' : 'Inactive' }
          </ListItem>
        </List>
      </Card>
    )
  }
}

FormView.propTypes = {
  dataLocal: ImmutablePropTypes.mapOf(
    ImmutablePropTypes.shape({
      name: PropTypes.string,
      version: PropTypes.number,
      active: PropTypes.bool
    })
  )
}

export default FormView
