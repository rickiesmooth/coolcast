import { Facebook } from 'expo'
import React from 'react'
import { AsyncStorage } from 'react-native'

export default Button =>
  class extends React.Component {
    async handleFBLogin() {
      console.log('✨going')
      const {
        type,
        token
      } = await Facebook.logInWithReadPermissionsAsync('354324435015552', {
        permissions: ['public_profile', 'email', 'user_friends']
        // behavior: 'native'
      })
      if (type === 'success') {
        const res = await this.props.authenticateUserWithGraphCool(token)
      }
    }

    render() {
      return <Button {...this.props} onPress={() => this.handleFBLogin()} />
    }
  }
