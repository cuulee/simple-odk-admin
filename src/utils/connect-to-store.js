import React from 'react'
import PureComponent from 'react-pure-render/component'

export default function connectToStore (Component, Store) {
  return class StoreConnector extends PureComponent {
    constructor () {
      super()
      this.state = Store.getState()
      Store.addChangeListener(this.onChange.bind(this))
    }

    onChange () {
      console.log('store changed')
      this.setState(Store.getState())
    }

    render () {
      return <Component {...this.props} store={Store} />
    }
  }
}
