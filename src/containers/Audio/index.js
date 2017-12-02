import React from 'react'
import AudioContainerComposer from './AudioContainer'
import { Asset, Audio, Font } from 'expo'

export default Player => {
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

    async _loadNewPlaybackInstance(src) {
      if (this.playerStore.playbackInstance != null) {
        await this.playerStore.playbackInstance.unloadAsync()
        this.playerStore.playbackInstance.setOnPlaybackStatusUpdate(null)
        this.playerStore.playbackInstance = null
      }
      const source = { uri: src || '' }
      const initialStatus = {
        shouldPlay: !!src,
        rate: this.playerStore.state.rate,
        volume: this.playerStore.state.volume
      }

      const { sound, status } = await Audio.Sound.create(
        source,
        initialStatus,
        this.playerStore._onPlaybackStatusUpdate
      )

      this.playerStore.playbackInstance = sound

      this.playerStore._updateScreenForLoading(false)
    }

    render() {
      const Container = AudioContainerComposer(Player)
      return (
        <Container
          {...this.props}
          _loadNewPlaybackInstance={this._loadNewPlaybackInstance}
        />
      )
    }
  }
}
