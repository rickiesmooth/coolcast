import React from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { FbLoginButton } from '../Buttons'
import { ProfileComposer } from '../../containers/Profile'
import { compose } from 'recompose'

import { User } from './User'

const ProfileSwitcher = ({ isLogin, ...rest }) => {
  return isLogin ? <Login {...rest} /> : <User {...rest} />
}

export const Profile = ProfileComposer(ProfileSwitcher)

export const Login = ({ back }) => {
  return (
    <View style={styles.container}>
      <FbLoginButton title={'Login with Facebook'} onSuccess={back} />
    </View>
  )
}

export { FollowModal } from './FollowModal'

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  thumb: {
    height: 100,
    width: 100,
    borderRadius: 50
  }
})
