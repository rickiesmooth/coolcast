import React from 'react'
import { observer, inject } from 'mobx-react'

import { pure, compose, withHandlers, withState, mapProps } from 'recompose'

export const ProfileComposer = Profile =>
  compose(
    inject('userStore'),
    observer,
    mapProps(props => {
      const { userStore, userId, location, back } = props
      return {
        currentUser: userStore.currentUser,
        isCurrentUser: !userId
          ? true
          : userStore.currentUser && userStore.currentUser.id === userId,
        isLogin: !userId || (location && location.pathname === '/login'),
        userId,
        back,
        userStore
      }
    }),
    withHandlers({
      logout: ({ userStore }) => val => {
        userStore.logout()
      },
      follow: ({ userStore }) => val => {
        userStore.follow(val)
      }
    }),
    pure
  )(Profile)
