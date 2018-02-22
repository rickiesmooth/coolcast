import React from 'react'
import { observer, inject } from 'mobx-react'

export default Header =>
  @inject('userStore')
  @observer
  class Enhanced extends React.Component {
    get currentUser() {
      return this.props.userStore.currentUser
    }
    render() {
      return <Header {...this.props} currentUser={this.currentUser} />
    }
  }
