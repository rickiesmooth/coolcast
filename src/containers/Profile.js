import React from 'react'
import { observer, inject } from 'mobx-react'

import { pure, compose, withHandlers, mapProps } from 'recompose'

export const ProfileComposer = Profile =>
  compose(
    inject('userStore'),
    observer,
    mapProps(
      ({ userStore: { currentUser }, userId, location, back, navigation }) => {
        const nativeProfile = navigation && navigation.state.key === 'Profile'
        const webLoginPath =
          !userId || (location && location.pathname === '/login')
        return {
          currentUser,
          isCurrentUser: !userId
            ? true
            : currentUser && currentUser.id === userId,
          isLogin: webLoginPath && !(nativeProfile && currentUser),
          userId,
          back
        }
      }
    ),
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
