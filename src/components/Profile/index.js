import React from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { FbLoginButton } from '../Buttons'
import { ProfileComposer } from '../../containers/Profile'

import { User } from './User'
import { FollowModal } from './FollowModal'

const ProfileSwitcher = ({ isLogin, ...rest }) =>
  isLogin ? <Login {...rest} /> : <User {...rest} />

export const Profile = ProfileComposer(ProfileSwitcher)

export const Login = ({ userStore, navigation, back }) => {
  return (
    <View style={styles.container}>
      <FbLoginButton
        title={'Login with Facebook'}
        login={userStore.login}
        onSuccess={back}
      />
    </View>
  )
}

export const Follow = FollowModal

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
