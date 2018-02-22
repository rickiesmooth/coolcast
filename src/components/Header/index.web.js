import React from 'react'
import { View, StyleSheet, Text, Image } from 'react-native'
import { ComposedSearchInputWithResults } from '../Search'
import HeaderContainerComposer from '../../containers/Header'
import { Link } from '../../navigation'
import { RowContainer, Container } from '../Views'

const Header = ({ currentUser }) => (
  <View style={styles.header}>
    <Container style={styles.content}>
      <View style={styles.left}>
        <Link to={'/'}>
          <Text style={styles.link}>Home</Text>
        </Link>
      </View>
      <View style={styles.middle}>
        <ComposedSearchInputWithResults />
      </View>
      <View style={styles.right}>
        <Link to={currentUser ? `/user/${currentUser.id}` : '/login'}>
          {currentUser ? (
            <Image
              style={styles.thumb}
              source={{
                uri: `https://graph.facebook.com/${currentUser.fbid}/picture?type=large`
              }}
            />
          ) : (
            <Text style={styles.link}>Login</Text>
          )}
        </Link>
      </View>
    </Container>
  </View>
)

export default HeaderContainerComposer(Header)

const styles = StyleSheet.create({
  header: {
    height: 66,
    borderBottomColor: 'rgba(0, 0, 0, 0.15)',
    borderBottomWidth: 1,
    zIndex: 1,
    width: '100%',
    position: 'relative',
    flexDirection: 'row'
  },
  content: {
    flexDirection: 'row',
    width: '100%'
  },
  left: {
    marginRight: 'auto',
    flexDirection: 'row',
    alignItems: 'center'
  },
  middle: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  right: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center'
  },
  thumb: {
    height: 35,
    width: 35,
    borderRadius: '50%'
  },
  link: {
    color: 'grey'
  }
})
