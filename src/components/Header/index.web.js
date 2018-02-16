import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { ComposedSearchInputWithResults } from '../../components/Search'
import { Link } from '../../navigation'

export default () => (
  <View style={styles.header}>
    <View style={styles.content}>
      <View style={styles.left}>
        <Link to={'/'}>
          <Text style={styles.link}>Home</Text>
        </Link>
      </View>
      <ComposedSearchInputWithResults />
      <View style={styles.right}>
        <Link to={'/profile'}>
          <Text style={styles.link}>Profile</Text>
        </Link>
      </View>
    </View>
  </View>
)

const styles = StyleSheet.create({
  left: {
    marginRight: 'auto'
  },
  link: {
    color: 'white'
  },
  content: {
    padding: 15,
    flexDirection: 'row',
    width: '100%'
  },
  right: {
    marginLeft: 'auto'
  },
  header: {
    width: '100%',
    zIndex: 1,
    position: 'relative',
    height: 48,
    backgroundColor: 'rgba(0,0,0,0.8)'
  }
})
