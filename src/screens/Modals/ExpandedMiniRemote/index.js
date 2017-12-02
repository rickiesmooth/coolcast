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

const DISABLED_OPACITY = 0.5

@inject('playerStore', 'currentStore')
@observer
export default class ExpandedMiniRemote extends React.Component {
  get playerStoreState() {
    return this.props.playerStore.state
  }

  get playerStore() {
    return this.props.playerStore
  }

  get currentStore() {
    return this.props.currentStore
  }

  _onSeekSliderValueChange = value => {
    if (
      this.playerStore.playbackInstance != null &&
      !this.playerStore.isSeeking
    ) {
      this.playerStore.isSeeking = true
      this.playerStore.shouldPlayAtEndOfSeek = this.playerStoreState.shouldPlay
      this.playerStore.playbackInstance.pauseAsync()
    }
  }

  _onSeekSliderSlidingComplete = async value => {
    if (this.playerStore.playbackInstance != null) {
      this.playerStore.isSeeking = false
      const seekPosition =
        value * this.playerStoreState.playbackInstanceDuration
      if (this.playerStore.shouldPlayAtEndOfSeek) {
        // millis
        this.playerStore.playbackInstance.playFromPositionAsync(seekPosition)
      } else {
        this.playerStore.playbackInstance.setPositionAsync(seekPosition)
      }
    }
  }

  _getSeekSliderPosition() {
    if (
      this.props.playerStore.playbackInstance != null &&
      this.playerStoreState.playbackInstancePosition != null &&
      this.playerStoreState.playbackInstanceDuration != null
    ) {
      return (
        this.playerStoreState.playbackInstancePosition /
        this.playerStoreState.playbackInstanceDuration
      )
    }
    return 0
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.thumb}
          source={{
            uri: this.props.currentStore.currentPodcastEpisodeMeta.thumbLarge
          }}
        />
        <View
          style={[
            styles.playbackContainer,
            {
              opacity: this.playerStoreState.isLoading ? DISABLED_OPACITY : 1.0
            }
          ]}
        >
          <Slider
            style={styles.playbackSlider}
            thumbImage={
              this.playerStore.isSeeking
                ? require('./track.png')
                : require('./thumb.png')
            }
            value={this._getSeekSliderPosition()}
            onValueChange={this._onSeekSliderValueChange}
            onSlidingComplete={this._onSeekSliderSlidingComplete}
            minimumTrackTintColor="#4CCFF9"
            disabled={this.playerStoreState.isLoading}
          />
        </View>
        <Text style={{ textAlign: 'center' }}>
          {this.currentStore.currentPlaying.title}
        </Text>
        <Text style={{ textAlign: 'center' }}>
          {this.currentStore.currentPodcastEpisodeMeta.title}
        </Text>

        <PlayButton playerStore={this.playerStore} />
      </View>
    )
  }
}

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
