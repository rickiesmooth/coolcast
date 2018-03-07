import React from 'react'
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  AsyncStorage
} from 'react-native'
import { observer, inject } from 'mobx-react'

import { pure, compose, withHandlers, mapProps, lifecycle } from 'recompose'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import FbLogin from './facebook'

import { UserQuery } from '../../../containers/Page'

export const FbApi = Button =>
  compose(
    inject('userStore'),
    graphql(loginMutation),
    withHandlers({
      verifyUser: props => async facebookToken => {
        const { mutate, userStore, data } = props
        console.log('✨facebookToken', facebookToken)
        const res = await mutate({
          variables: { facebookToken }
        }).then(res => res.data.authenticate)
        console.log('✨res', res)
        const { token, user } = res
        AsyncStorage.setItem('graphcoolToken', token)
        userStore.setCurrentUser({ me: user })
        console.log('✨success', user)
        props.onSuccess()
      }
    }),
    pure
  )(FbLogin(Button))

const loginMutation = gql`
  mutation LoginOrSignup($facebookToken: String!) {
    authenticate(facebookToken: $facebookToken) {
      user {
        id
        email
        fbid
      }
      token
    }
  }
`
