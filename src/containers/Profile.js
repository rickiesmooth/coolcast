import React from 'react'
import { observer, inject } from 'mobx-react'

import { pure, compose, withHandlers, mapProps } from 'recompose'

export const ProfileComposer = Profile =>
  compose(
    inject('userStore'),
    observer,
    mapProps(({ userStore, userId, location, back, navigation }) => {
      const nativeProfile = navigation && navigation.state.key === 'Profile'
      const currentUser = userStore.currentUser
      const webLoginPath =
        !userId || (location && location.pathname === '/login')
      return {
        currentUser,
        isCurrentUser: !userId
          ? true
          : currentUser && currentUser.id === userId,
        isLogin: webLoginPath && !(nativeProfile && currentUser),
        userId,
        logout: userStore.logout,
        back
      }
    }),
    withHandlers({
      logout: ({ logout }) => val => logout(),
      follow: ({ userStore }) => val => {
        userStore.follow(val)
      }
    }),
    pure
  )(Profile)
