import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Icon } from '../Icons'

export const PlayButton = props => {
  const { isPlaying, size, color, isLoading, onPlayPausePressed } = props
  return (
    <TouchableOpacity
      onPress={onPlayPausePressed}
      disabled={isLoading}
      style={styles.wrapper}
    >
      <View>
        <Icon name={!isPlaying ? 'play' : 'pause'} size={24} color={color} />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'center',
    marginTop: 'auto',
    marginBottom: 'auto'
  }
})
