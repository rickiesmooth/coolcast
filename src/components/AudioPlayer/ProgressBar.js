import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { Slider } from '../../utils'

export const ProgressBar = props => {
  const {
    duration,
    value,
    _onSeekSliderValueChange,
    _onSeekSliderSlidingComplete
  } = props
  const dur = duration * 1000
  return (
    <View style={styles.wrapper}>
      <View style={styles.text}>
        <Text>{getReadableTime(value * dur)}</Text>
      </View>
      <View style={styles.slider}>
        <Slider
          value={value || 0}
          onValueChange={_onSeekSliderValueChange}
          onSlidingComplete={_onSeekSliderSlidingComplete}
        />
      </View>
      <View style={styles.text}>
        <Text>{getReadableTime(dur)}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row'
  },
  slider: {
    alignSelf: 'center',
    flex: 1
  },
  text: {
    opacity: 0.8,
    marginHorizontal: 15
  }
})

function getReadableTime(value) {
  var durmins = Math.floor(value / 60)
  var dursecs = Math.floor(value - durmins * 60)
  if (dursecs < 10) {
    dursecs = '0' + dursecs
  }
  if (durmins < 10) {
    durmins = '0' + durmins
  }
  return durmins + ':' + dursecs
}
