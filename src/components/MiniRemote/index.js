import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Animated,
  Dimensions
} from 'react-native'
import { Title, Subline } from '../Text'
import { Link } from '../../navigation'

import AudioContainerComposer from '../../containers/Audio'
import { PlayButton, ProgressBar } from '../AudioPlayer'

const { height, width } = Dimensions.get('window')
const notPhone = width > 768

const MiniRemote = props => {
  const {
    artist,
    title,
    progress,
    isPlaying,
    duration,
    navigation,
    onSeekSliderSlidingComplete,
    onSeekSliderValueChange,
    onPlayPausePressed
  } = props
  return (
    <View>
      {!notPhone && (
        <View
          style={[{ width: `${progress * 100}%` }, styles.progressBarPhone]}
        />
      )}
      <View style={styles.container}>
        <View style={styles.playbackContainer}>
          <View style={styles.playButton}>
            <PlayButton
              isPlaying={isPlaying}
              onPlayPausePressed={onPlayPausePressed}
            />
          </View>
          {notPhone && (
            <View style={styles.progressBar}>
              <ProgressBar
                progress={progress}
                duration={duration}
                onSeekSliderSlidingComplete={onSeekSliderSlidingComplete}
                onSeekSliderValueChange={onSeekSliderValueChange}
              />
            </View>
          )}
        </View>
        <Link to={'/ExpandedMiniRemote'} style={{ color: 'inherit' }}>
          <View style={styles.detailsContainer}>
            <Title text={artist} size={'small'} numberOfLines={1} />
            <Subline text={title} size={'small'} numberOfLines={1} />
          </View>
        </Link>
      </View>
      {props.children}
    </View>
  )
}

export default AudioContainerComposer(MiniRemote)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: Platform.OS === 'web' ? 'fixed' : 'relative',
    bottom: 0,
    zIndex: 1,
    width: '100%',
    height: 50,
    backgroundColor: '#f2f2f2',
    overflow: 'hidden'
  },
  playbackContainer: {
    flex: notPhone ? 2 : 0,
    flexDirection: 'row'
  },
  progressBarPhone: {
    backgroundColor: 'green',
    height: 4
  },
  progressBar: {
    justifyContent: 'center',
    flex: 1
  },
  progressBarSliderThumb: {
    height: 16,
    width: 16,
    bottom: -6,
    position: 'absolute',
    backgroundColor: 'red',
    right: 0,
    borderRadius: 50
  },
  playButton: {
    height: 40,
    width: 40,
    marginBottom: 'auto',
    marginTop: 'auto',
    alignSelf: 'flex-start'
  }
})
