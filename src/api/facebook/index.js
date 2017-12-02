import { Facebook } from 'expo'
import React from 'react'
import AsyncStorage from 'react-native'

export default Button =>
  class extends React.Component {
    async handleFBLogin() {
      const {
        type,
        token
      } = await Facebook.logInWithReadPermissionsAsync('354324435015552', {
        permissions: ['public_profile', 'email'],
        behavior: 'native'
      })
      if (type === 'success') {
        const res = await this.props.authenticateUserWithGraphCool({
          variables: {
            facebookToken: token
          }
        })
        this.props.userStore.setCurrentUser(res.data.authenticateUser)
        AsyncStorage.setItem('graphcoolToken', res.data.authenticateUser.token)
      }
    }

    render() {
      return <Button {...this.props} action={() => this.handleFBLogin()} />
    }
  }
