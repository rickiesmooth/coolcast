import React from 'react'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { FbApi } from './FbApi'

export const Button = props => {
  const { textColor, fontSize, title, style, onPress } = props
  return (
    <TouchableOpacity onPress={onPress} style={[style, styles.content]}>
      <Text style={{ color: textColor, fontSize }}>{title}</Text>
    </TouchableOpacity>
  )
}

export const LikeButton = props => {
  return (
    <Button
      {...props}
      style={[props.liked ? styles.active : styles.inactive]}
      title={props.liked ? 'Unlike' : 'Like'}
    />
  )
}

const FbLogin = FbApi(Button)

export const FbLoginButton = ({ onSuccess, title, ...rest }) => {
  return (
    <View style={[styles.facebook, styles.button]}>
      <FbLogin
        textColor={'#FFF'}
        fontSize={18}
        title={title}
        onSuccess={onSuccess}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  facebook: {
    backgroundColor: '#3b5998'
  },
  button: {
    padding: 10,
    borderRadius: 5
  },
  active: {
    color: 'green'
  },
  inactive: {
    color: 'red'
  }
})
