import React from 'react'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import FbLoginApi from './facebook'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

export const Button = props => {
  const { textColor, fontSize, action, title, style } = props
  return (
    <TouchableOpacity onPress={action} style={[style, styles.content]}>
      <Text style={{ color: textColor, fontSize }}>{title}</Text>
    </TouchableOpacity>
  )
}

export const LikeButton = props => {
  return (
    <Button
      style={[styles.button, props.liked ? styles.active : styles.inactive]}
      title={props.liked ? 'Unlike' : 'Like'}
      action={props.api}
    />
  )
}

const FbLogin = FbLoginApi(Button)

export const FbLoginButton = props => {
  console.log('✨props', props)
  return (
    <View style={[styles.facebook, styles.button]}>
      <FbLogin
        {...props}
        textColor={'#FFF'}
        fontSize={18}
        authenticateUserWithGraphCool={props.userStore.authenticate}
      />
    </View>
  )
}

const AUTHENTICATE_FACEBOOK_USER = gql`
  mutation authenticate($facebookToken: String!) {
    authenticateUser(facebookToken: $facebookToken) {
      facebookUserId
      id
      token
      email
    }
  }
`

// export const FbLoginButton = graphql(AUTHENTICATE_FACEBOOK_USER, {
//   name: 'authenticateUserWithGraphCool'
// })(FacebookLogin)

const styles = StyleSheet.create({
  facebook: {
    backgroundColor: '#3b5998'
  },
  button: {
    padding: 10,
    borderRadius: 5
  },
  active: {
    backgroundColor: 'green'
  },
  inactive: {
    backgroundColor: 'red'
  }
})
