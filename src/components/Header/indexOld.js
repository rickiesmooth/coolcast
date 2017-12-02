import React from 'react'
import {
  Animated,
  Image,
  Platform,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView
} from 'react-native'

const NAVBAR_HEIGHT = 64
const STATUS_BAR_HEIGHT = Platform.select({ ios: 20, android: 24 })

const HEADER_MAX_HEIGHT = 300
const HEADER_MIN_HEIGHT = Platform.select({ ios: 64, android: 73 })
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT

import { observable, computed } from 'mobx'
import { observer, inject } from 'mobx-react'

export const HeaderComposer = HeaderContent =>
  class Enhanced extends React.Component {
    constructor(props) {
      super(props)

      const scrollAnim = new Animated.Value(0)
      const offsetAnim = new Animated.Value(0)

      this.state = {
        scrollAnim,
        offsetAnim,
        clampedScroll: Animated.diffClamp(
          Animated.add(
            scrollAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
              extrapolateLeft: 'clamp'
            }),
            offsetAnim
          ),
          0,
          NAVBAR_HEIGHT - STATUS_BAR_HEIGHT
        )
      }
    }

    _clampedScrollValue = 0
    _offsetValue = 0
    _scrollValue = 0

    componentDidMount() {
      this.state.scrollAnim.addListener(({ value }) => {
        const diff = value - this._scrollValue
        this._scrollValue = value
        this._clampedScrollValue = Math.min(
          Math.max(this._clampedScrollValue + diff, 0),
          NAVBAR_HEIGHT - STATUS_BAR_HEIGHT
        )
      })
      this.state.offsetAnim.addListener(({ value }) => {
        this._offsetValue = value
      })
    }

    componentWillUnmount() {
      this.state.scrollAnim.removeAllListeners()
      this.state.offsetAnim.removeAllListeners()
    }

    _onScrollEndDrag = () => {
      this._scrollEndTimer = setTimeout(this._onMomentumScrollEnd, 250)
    }

    _onMomentumScrollBegin = () => {
      clearTimeout(this._scrollEndTimer)
    }

    _onMomentumScrollEnd = () => {
      const toValue =
        this._scrollValue > NAVBAR_HEIGHT &&
        this._clampedScrollValue > (NAVBAR_HEIGHT - STATUS_BAR_HEIGHT) / 2
          ? this._offsetValue + NAVBAR_HEIGHT
          : this._offsetValue - NAVBAR_HEIGHT

      Animated.timing(this.state.offsetAnim, {
        toValue,
        duration: 350,
        useNativeDriver: true
      }).start()
    }
    render() {
      const { clampedScroll } = this.state

      const navbarTranslate = clampedScroll.interpolate({
        inputRange: [0, NAVBAR_HEIGHT - STATUS_BAR_HEIGHT],
        outputRange: [0, -(NAVBAR_HEIGHT - STATUS_BAR_HEIGHT)],
        extrapolate: 'clamp'
      })
      const navbarOpacity = clampedScroll.interpolate({
        inputRange: [0, NAVBAR_HEIGHT - STATUS_BAR_HEIGHT],
        outputRange: [1, 0],
        extrapolate: 'clamp'
      })

      return (
        <View style={styles.fill}>
          <Animated.ScrollView
            style={[styles.fill]}
            scrollEventThrottle={1}
            onScroll={Animated.event(
              [
                { nativeEvent: { contentOffset: { y: this.state.scrollAnim } } }
              ],
              { useNativeDriver: true }
            )}
          >
            <View style={styles.contentContainer}>
              <HeaderContent />
            </View>
          </Animated.ScrollView>
          <Animated.View
            style={[
              styles.navbar,
              { transform: [{ translateY: navbarTranslate }] }
            ]}
          >
            <Animated.Text style={[styles.title, { opacity: navbarOpacity }]}>
              {'this.currentPodcastEpisodeMeta.title'}
            </Animated.Text>
          </Animated.View>
        </View>
      )
    }
  }

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
    paddingTop: STATUS_BAR_HEIGHT
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
