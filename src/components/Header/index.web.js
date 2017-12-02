import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import {
  ComposedSearchInput,
  ComposedSearchResults
} from '../../components/Search'
import { Link } from '../../navigation'

export default class Header extends React.Component {
  render() {
    return (
      <View style={styles.header}>
        <View style={styles.content}>
          <View style={styles.left}>
            <Link to={'/'}>
              <Text style={styles.link}>Home</Text>
            </Link>
          </View>
          <View style={styles.search}>
            <ComposedSearchInput />
            <ComposedSearchResults style={styles.results} />
          </View>
          <View style={styles.right}>
            <Link to={'/profile'}>
              <Text style={styles.link}>Profile</Text>
            </Link>
          </View>
        </View>
      </View>
    )
  }
}

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
  search: {
    width: '400px',
    position: 'relative',
    display: 'block',
    overflow: 'visible'
  },
  header: {
    width: '100%',
    position: 'relative',
    zIndex: 1,
    height: 48,
    backgroundColor: 'rgba(0,0,0,0.8)'
  },
  results: {
    backgroundColor: 'white',
    width: '100%'
  }
})
