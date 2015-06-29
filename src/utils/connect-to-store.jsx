import React from 'react'

/**
 * This can be used as a decorator:
 *
 * ```
 * @connectToStore(MyStore)
 * class MyComponent extends React.Component {
 * //...
 * }
 * ```
 *
 * Or in vanilla JS:
 *
 * var MyComponent = React.createElement({
 * //...
 * })
 *
 * export connectToStore(MyStore)(MyComponent)
 *
 * @param  {Store} Store - A store, only needs to implement `addChangeListener()` and `getState()`
 * @return {React.Component} - Returns a wrapped higher-order element
 */
export default function connectToStore (Store) {
  return function (Component) {
    return class StoreConnector extends React.Component {
      constructor () {
        super()
        this.state = Store.getState()
        Store.addChangeListener(this.onChange.bind(this))
      }

      onChange () {
        this.setState(Store.getState())
      }

      render () {
        const { dataLocal, dataRemote } = this.state
        return <Component {...this.props} dataLocal={dataLocal} dataRemote={dataRemote} />
      }
    }
  }
}
