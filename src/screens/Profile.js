import React from 'react'
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native'
import { Button, FbLoginButton } from '../components/Buttons'

import { observable, computed } from 'mobx'
import { observer, inject } from 'mobx-react'

@inject('currentStore')
@observer
export default class Profile extends React.Component {
  @computed
  get currentUser() {
    return this.props.currentStore.currentUser
  }

  render() {
    if (this.currentUser.id) {
      return <LoggedInUser currentUser={this.currentUser} />
    } else {
      return (
        <View style={styles.container}>
          <FbLoginButton
            currentStore={this.props.currentStore}
            title={'Login with Facebook'}
          />
        </View>
      )
    }
  }
}

class LoggedInUser extends React.Component {
  render() {
    const { email, facebookUserId } = this.props.currentUser
    return (
      <View style={styles.container}>
        <Image
          style={styles.thumb}
          source={{
            uri: `https://graph.facebook.com/${facebookUserId}/picture?type=large`
          }}
        />
        <Text>{email}</Text>
        <Button
          title={'Logout'}
          action={() => {
            global.localStorage.clear()
            this.props.currentUser.id = false
          }}
        />
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
