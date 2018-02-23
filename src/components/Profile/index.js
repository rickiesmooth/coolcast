import React from 'react'
import { View, StyleSheet, Image, Text, ActivityIndicator } from 'react-native'
import { FbLoginButton, Button } from '../Buttons'
import { observer, inject } from 'mobx-react'
import { Title } from '../Text'

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
    this.user && console.log('✨this.user.following[0]', this.user.following[0])
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
        <View style={{ flexDirection: 'row' }}>
          <Title
            text={`${this.user.following.length} following`}
            size={'large'}
            style={{
              marginRight: 20
            }}
          />
          <Title
            text={`${this.user.followers.length} followers`}
            size={'large'}
          />
        </View>
        {this.isCurrentUser ? (
          <Button title={'Logout'} onPress={this.props.userStore.logout} />
        ) : (
          <Button
            title={'Follow'}
            onPress={() => this.props.userStore.follow(this.user.id)}
          />
        )}
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
