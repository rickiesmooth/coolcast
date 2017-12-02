import React from 'react'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import FbLoginApi from '../../api/facebook'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

export const Button = props => {
  const { textColor, fontSize, action, title } = props
  return (
    <TouchableOpacity onPress={action}>
      <Text style={{ color: textColor, fontSize }}>{title}</Text>
    </TouchableOpacity>
  )
}

const FbLogin = FbLoginApi(Button)

const FacebookLogin = props => {
  return (
    <View style={styles.facebook}>
      <FbLogin {...props} textColor={'#FFF'} fontSize={18} />
    </View>
  )
}

const AUTHENTICATE_FACEBOOK_USER = gql`
  mutation AuthenticateUserMutation($facebookToken: String!) {
    authenticateUser(facebookToken: $facebookToken) {
      facebookUserId
      id
      token
      email
    }
  }
`

export const FbLoginButton = graphql(AUTHENTICATE_FACEBOOK_USER, {
  name: 'authenticateUserWithGraphCool'
})(FacebookLogin)

const styles = StyleSheet.create({
  facebook: {
    backgroundColor: '#3b5998',
    padding: 10,
    borderRadius: 5
  }
})
