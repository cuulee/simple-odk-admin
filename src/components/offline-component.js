import React from 'react'
import PureComponent from 'react-pure-render/component'
import ImmutablePropTypes from 'react-immutable-proptypes'

class OfflineComponent extends React.Component {
  getInLocal (keyPath) {
    return this.props.dataLocal.getIn(keyPath)
  }

  getInRemote (keyPath) {
    return this.props.dataRemote.getIn(keyPath)
  }

  getInLocalRemote (keyPath) {
    return {
      dataLocal: this.getInLocal(keyPath),
      dataRemote: this.getInRemote(keyPath),
      keyPath: keyPath
    }
  }

  isPending (keyPath) {
    return this.getInLocal(keyPath) !== this.getInRemote(keyPath)
  }

  error (keyPath) {
    if (!this.isPending(keyPath)) return
    while (keyPath.pop()) {
      let error = this.getInLocal(keyPath.concat('error'))
      if (error) return error
    }
  }
}

OfflineComponent.propTypes = {
  dataLocal: ImmutablePropTypes.map,
  dataRemote: ImmutablePropTypes.map
}

export default OfflineComponent
