import React from 'react'
import {
  Button,
  View,
  Image,
  StyleSheet,
  Slider,
  Text,
  TouchableHighlight
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { observer, inject } from 'mobx-react'
import { computed } from 'mobx'
import { PlayButton } from '../../../components/AudioPlayer/PlayButton'
import AudioContainerComposer from '../../../containers/Audio'

const DISABLED_OPACITY = 0.5
@inject('playerStore', 'userStore')
@observer
class ExpandedMiniRemote extends React.Component {
  render() {
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
    } = this.props

    return (
      <View style={styles.container}>
        <Image style={styles.thumb} source={{ uri: title }} />
        <View style={[styles.playbackContainer]}>
          <Slider
            style={styles.playbackSlider}
            thumbImage={
              this.props.playerStore.isSeeking
                ? require('./track.png')
                : require('./thumb.png')
            }
            value={progress}
            onValueChange={onSeekSliderValueChange}
            onSlidingComplete={onSeekSliderSlidingComplete}
            minimumTrackTintColor="#4CCFF9"
          />
        </View>
        <Text style={{ textAlign: 'center' }}>{artist}</Text>
        <Text style={{ textAlign: 'center' }}>{title}</Text>

        <PlayButton
          isPlaying={isPlaying}
          onPlayPausePressed={onPlayPausePressed}
        />
      </View>
    )
  }
}

export default AudioContainerComposer(ExpandedMiniRemote)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  playbackContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  playbackSlider: {
    alignSelf: 'stretch'
  },
  thumb: {
    height: '50%',
    width: '100%'
  }
})
