import React from 'react'
import { View, StyleSheet, Platform } from 'react-native'
const IS_IOS = Platform.OS === 'ios'
console.log('✨Platform', IS_IOS)
export const Container = ({ style, children }) => (
  <View style={[styles.Container, style]}>{children}</View>
)

export const ItemHeaderContainer = ({ style, children }) => (
  <View style={[styles.ItemHeaderContainer, style]}>{children}</View>
)

export const RowContainer = ({ children }) => (
  <View style={{ marginTop: IS_IOS ? 20 : 0 }}>{children}</View>
)

export const ModalContainer = ({ children }) => (
  <View style={styles.Modal}>{children}</View>
)

const styles = StyleSheet.create({
  Container: { margin: 20 },
  Modal: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'red'
  },
  ItemHeaderContainer: {
    margin: 15,
    flexDirection: 'row',
    borderColor: 'grey',
    paddingBottom: 15,
    borderBottomWidth: 1
  }
})
