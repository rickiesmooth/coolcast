import React from 'react'
import { View, StyleSheet, Animated, Platform } from 'react-native'

const NAVBAR_HEIGHT = 64
const STATUS_BAR_HEIGHT = Platform.select({ ios: 20, android: 24 })

const HEADER_MAX_HEIGHT = 300
const HEADER_MIN_HEIGHT = Platform.select({ ios: 64, android: 73 })
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT

import HeaderContainerComposer from '../../containers/Header'

const Header = props => {
  const { navbarTranslate, navbarOpacity, scrollAnim, title } = props

  return (
    <View style={styles.fill}>
      <Animated.ScrollView
        style={[styles.fill]}
        scrollEventThrottle={1}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollAnim } } }],
          { useNativeDriver: true }
        )}
      >
        <View style={styles.contentContainer}>{props.children}</View>
      </Animated.ScrollView>
      <Animated.View
        style={[
          styles.navbar,
          { transform: [{ translateY: navbarTranslate }] }
        ]}
      >
        <Animated.Text style={[styles.title, { opacity: navbarOpacity }]}>
          {title}
        </Animated.Text>
      </Animated.View>
    </View>
  )
}

export default HeaderContainerComposer(Header)

const styles = StyleSheet.create({
  fill: {
    flex: 1
  },
  navbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: '#dedede',
    borderBottomWidth: 1,
    height: NAVBAR_HEIGHT,
    justifyContent: 'center',
    paddingTop: 0
  },
  contentContainer: {
    marginTop: NAVBAR_HEIGHT
  },
  title: {
    color: '#333333'
  },
  row: {
    width: null,
    marginBottom: 1,
    padding: 16,
    backgroundColor: 'transparent'
  },
  rowText: {
    color: 'white',
    fontSize: 18
  }
})
