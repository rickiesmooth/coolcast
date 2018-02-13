import React from 'react'
import AudioContainerComposer from './AudioContainer'
import { Asset, Audio, Font } from 'expo'

export default Player => {
  const Container = AudioContainerComposer(Player)
  return class Enhanced extends React.Component {
    componentDidMount() {
      Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX
      })
      this._loadNewPlaybackInstance(false)
    }

    async _loadNewPlaybackInstance(episode) {
      const playerStore = this.playerStore
      const progress = episode.progress
      if (playerStore.playbackInstance != null) {
        await playerStore.playbackInstance.unloadAsync()
        playerStore.playbackInstance.setOnPlaybackStatusUpdate(null)
        playerStore.playbackInstance = null
      }

      const source = { uri: episode.src || '' }
      const initialStatus = {
        shouldPlay: !!episode.src,
        rate: playerStore.state.rate,
        volume: playerStore.state.volume
      }

      const { sound, status } = await Audio.Sound.create(
        source,
        initialStatus,
        playerStore.onPlaybackStatusUpdate
      )

      playerStore.playbackInstance = sound

      if (progress) {
        playerStore.playbackInstance.playFromPositionAsync(
          progress * playerStore.state.playbackInstanceDuration
        )
      } else {
        playerStore.playbackInstance.playAsync()
      }

      playerStore._updateScreenForLoading(false)
    }

    render() {
      return (
        <Container
          {...this.props}
          _loadNewPlaybackInstance={this._loadNewPlaybackInstance}
        />
      )
    }
  }
}
