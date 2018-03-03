import React from 'react'
import { observer, inject } from 'mobx-react'

export const ProfileComposer = Component =>
  @inject('userStore')
  @observer
  class Enhanced extends React.Component {
    get currentUser() {
      return this.props.userStore.currentUser
    }
    get isCurrentUser() {
      return !this.props.userId
        ? true
        : this.props.userStore.currentUser &&
            this.props.userStore.currentUser.id === this.props.userId
    }
    get isLogin() {
      return (
        !this.props.userId ||
        (this.props.location && this.props.location.pathname === '/login')
      )
    }

    render() {
      return (
        <Component
          {...this.props}
          currentUser={this.currentUser}
          isCurrentUser={this.isCurrentUser}
          user={this.user}
          isLogin={this.isLogin}
        />
      )
    }
  }

// export const FollowModalComposer = Content =>
//   @inject('userStore')
//   @observer
//   class Enhanced extends React.Component {
//     get currentTarget() {
//       return this.props.userStore.users.get(this.props.userId)
//     }
//
//     get followList() {
//       return this.currentTarget[
//
//       ]
//     }
//     render() {
//       return <Content {...this.props} followList={this.followList} />
//     }
//   }
