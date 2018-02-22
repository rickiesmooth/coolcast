import React from 'react'
import { observer, inject } from 'mobx-react'

export default Login =>
  @inject('userStore')
  @observer
  class Enhanced extends React.Component {
    get currentUser() {
      return this.props.userStore.currentUser
    }
    render() {
      return <Login {...this.props} currentUser={this.currentUser} />
    }
  }
