import React from 'react'
import { Login, User } from '../components/Profile'
import { PageComposer } from '../containers/Page'
import { observer, inject } from 'mobx-react'

@inject('userStore')
@observer
class Profile extends React.Component {
  get currentUser() {
    return this.props.userStore.currentUser
  }
  render() {
    const navigationKey = this.props.navigationKey // when landing
    if (!this.currentUser && !navigationKey) {
      return <Login {...this.props} />
    } else {
      return <User {...this.props} />
    }
  }
}
export const ProfileScreen = PageComposer(Profile)
