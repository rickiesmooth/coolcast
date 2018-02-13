import React from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  AsyncStorage
} from 'react-native'
import { Button, FbLoginButton } from '../components/Buttons'

import { observable, computed } from 'mobx'
import { observer, inject } from 'mobx-react'

@inject('userStore', 'apolloStore')
@observer
export default class Profile extends React.Component {
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

class LoggedInUser extends React.Component {
  render() {
    const { logout, currentUser } = this.props
    const { email, fbid } = currentUser

    return (
      <View style={styles.container}>
        <Image
          style={styles.thumb}
          source={{
            uri: `https://graph.facebook.com/${fbid}/picture?type=large`
          }}
        />
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
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'blue'
  }
})
