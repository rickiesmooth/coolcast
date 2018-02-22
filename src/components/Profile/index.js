import React from 'react'
import { View, StyleSheet, Image, Text, ActivityIndicator } from 'react-native'
import { FbLoginButton, Button } from '../Buttons'
import { observer, inject } from 'mobx-react'

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

@inject('userStore')
@observer
export class User extends React.Component {
  get isCurrentUser() {
    const { userStore } = this.props
    return (
      !this.props.navigationKey ||
      (userStore.currentUser &&
        userStore.currentUser.id === this.props.navigationKey)
    )
  }
  get user() {
    const { userStore, navigationKey } = this.props
    if (!navigationKey) {
      return userStore.currentUser
    } else {
      return userStore.users.get(this.props.navigationKey)
    }
  }
  componentDidMount() {
    if (this.props.navigationKey && !this.user) {
      this.props.userStore.getUser(this.props.navigationKey)
    }
  }
  render() {
    const logout = this.props.userStore.logout
    return this.user ? (
      <View style={styles.container}>
        <Image
          style={styles.thumb}
          source={{
            uri: `https://graph.facebook.com/${this.user
              .fbid}/picture?type=large`
          }}
        />
        <Text>{this.user.name}</Text>
        <Text>{this.user.email}</Text>
        {this.isCurrentUser && <Button title={'Logout'} onPress={logout} />}
      </View>
    ) : (
      <ActivityIndicator size="large" />
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
