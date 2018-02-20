import React from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  AsyncStorage,
  ActivityIndicator
} from 'react-native'
import { Button, FbLoginButton } from '../components/Buttons'

import { observable, computed } from 'mobx'
import { observer, inject } from 'mobx-react'

@inject('userStore', 'apolloStore')
@observer
export class Profile extends React.Component {
  render() {
    const { currentUser, logout } = this.props.userStore
    if (currentUser) {
      return <LoggedInUser currentUser={currentUser} logout={logout} />
    } else {
      return (
        <View style={styles.container}>
          <FbLoginButton
            apolloStore={this.props.apolloStore}
            userStore={this.props.userStore}
            title={'Login with Facebook'}
          />
        </View>
      )
    }
  }
}

@inject('userStore', 'apolloStore')
export class User extends React.Component {
  get userId() {
    const { match, navigation } = this.props
    return match ? match.params.id : navigation.state.params
  }
  get user() {
    return this.props.userStore.users.get(this.userId)
  }
  render() {
    return this.user ? (
      <View style={styles.container}>
        <Image
          style={styles.thumb}
          source={{
            uri: `https://graph.facebook.com/${user.fbid}/picture?type=large`
          }}
        />
        <Text>{this.user.name}</Text>
        <Text>{this.user.email}</Text>
      </View>
    ) : (
      <ActivityIndicator size="large" />
    )
  }
}

export class LoggedInUser extends React.Component {
  render() {
    const { logout, currentUser } = this.props
    const { email, fbid, name } = currentUser

    return (
      <View style={styles.container}>
        <Image
          style={styles.thumb}
          source={{
            uri: `https://graph.facebook.com/${fbid}/picture?type=large`
          }}
        />
        <Text>{name}</Text>
        <Text>{email}</Text>
        <Button title={'Logout'} onPress={logout} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
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
