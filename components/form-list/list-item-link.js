import React from 'react'
import { ListItem } from 'material-ui'

/**
 * Wraps a material-ui [<ListItem>](http://callemall.github.io/material-ui/#/components/lists)
 * to make it behave like react-router [<Link>]()
 */
class ListItemLink extends React.Component {
  constructor () {
    super()
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (event) {
    const { router } = this.context
    event.preventDefault()
    router.transitionTo(this.props.to)
  }

  render () {
    const { router } = this.context

    const props = Object.assign({}, this.props, {
      href: router.makeHref(this.props.to),
      onClick: this.handleClick,
      disableTouchRipple: true
    })

    if (router.isActive(this.props.to)) {
      props.style = Object.assign({}, props.style, this.props.activeStyle)
    }

    return (
      <ListItem {...props}>
        {this.props.children}
      </ListItem>
    )
  }
}

ListItemLink.propTypes = {
  to: React.PropTypes.string.isRequired,
  style: React.PropTypes.object,
  activeStyle: React.PropTypes.object,
  children: React.PropTypes.array
}

// Make router available on context
ListItemLink.contextTypes = {
  router: React.PropTypes.object
}

export default ListItemLink
