import React, { PropTypes } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Card, CardTitle, List, ListItem,
  Toggle, ListDivider, RaisedButton, Table, Paper } from 'material-ui'

import { IconActive, IconInactive, IconUpload } from './icons'
import { LocalActions } from '../actions'
import OfflineComponent from './offline-component'

const styles = {
  wrapper: {
    position: 'absolute',
    width: '100%'
  },
  card: {
    maxWidth: 640,
    margin: '8px auto'
  },
  uploadButton: {
    marginRight: 8
  },
  responseList: {
    margin: '16px 8px'
  },
  noResponse: {
    padding: 16
  }
}

class FormView extends OfflineComponent {
  handleActiveClick () {
    const { sourceId, ownerId, storeId, formId } = this.props.params
    const state = this.getInLocal([])
    const newState = state.updateIn(['data', 'active'], v => !v)
    LocalActions.toggleActive({
      sourceId,
      ownerId,
      storeId,
      formId: decodeURIComponent(formId),
      data: newState
    })
  }

  render () {
    const activeKeyPath = ['data', 'active']
    const isActive = this.getInLocal(activeKeyPath)
    const isActivePending = this.isPending(activeKeyPath)
    const isActiveError = this.error(activeKeyPath)
    const submissions = this.getInLocal(['responses', 'collection']).toArray().map(v => {
      let props = v.get('data').properties
      return { Date: {content: props.today}, Placename: {content: props.placename},
       What: {content: props.happening}, Region: {content: props.region}}
    })
    let colOrder = [ 'Date', 'Placename', 'What', 'Region']
    return (
      <div style={styles.wrapper}>
        <Card style={styles.card}>
          <CardTitle
            title={this.getInLocal(['data', 'name'])}
            subtitle={'Version ' + this.getInLocal(['data', 'xformVersion'])}
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
              leftIcon={isActive ? <IconActive /> : <IconInactive />}
              rightToggle={<Toggle toggled={isActive} onToggle={this.handleActiveClick.bind(this)} />}
              secondaryText={<p>Only active forms can be downloaded in ODK Collect</p>}
              >
              { isActive ? 'Active' : 'Inactive' }
            </ListItem>
          </List>
        </Card>
        <Paper zDepth={2} style={styles.responseList}>
          <Table rowData={submissions} columnOrder={colOrder} showRowHover={true} multiSelectable={true} />
          { submissions.length === 0 && (
            <div style={styles.noResponse}>{'No responses received yet'}</div>
          )}
        </Paper>
      </div>
    )
  }
}

FormView.propTypes = {
  dataLocal: ImmutablePropTypes.map,
  params: PropTypes.object
}

export default FormView
