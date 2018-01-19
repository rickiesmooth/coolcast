import React from 'react'
import { View } from 'react-native'
import AudioContainerComposer from './AudioContainer'
import { observer, inject } from 'mobx-react'

export default Player => {
  const Container = AudioContainerComposer(Player)
  return @inject('playerStore')
  @observer
  class Enhanced extends React.Component {
    constructor(props) {
      super()
      this.audio = document.createElement('audio')
      this.audio.ontimeupdate = () =>
        this.props.playerStore.onPlaybackStatusUpdate({
          positionMillis: this.audio.currentTime * 1000,
          isLoaded: true,
          durationMillis: this.audio.duration * 1000,
          shouldPlay: true,
          isPlaying: !this.audio.paused,
          isBuffering: false,
          rate: 1,
          volume: 1
        })
    }
    async _loadNewPlaybackInstance(episode) {
      const playerStore = this.playerStore
      if (playerStore.playbackInstance != null) {
        await playerStore.playbackInstance.unloadAsync()
        playerStore.playbackInstance = null
      }
      this.audio.src = episode.src
      playerStore.playbackInstance = {
        unloadAsync: () => {
          this.audio.src = ''
          this.audio.load()
        },
        pauseAsync: playing => {
          this.audio.pause()
        },
        playAsync: () => {
          this.audio.play()
        },
        playFromPositionAsync: time => {
          this.audio.currentTime = time / 1000
          this.audio.play()
        },
        setPositionAsync: (time, percentage) => {
          if (!this.audio.duration) {
            this.audio.onloadedmetadata = () => {
              this.audio.currentTime = percentage
                ? time * this.audio.duration
                : time
              playerStore.state.shouldPlay && this.audio.play()
            }
          } else {
            this.audio.currentTime = time
            playerStore.state.shouldPlay && this.audio.play()
          }
        }
      }
      const progress = episode.progress
      progress
        ? playerStore.playbackInstance.setPositionAsync(progress, true)
        : playerStore.playbackInstance.playAsync()

      playerStore.updateScreenForLoading(false)
    }

    render() {
      return (
        <Container
          {...this.props}
          _loadNewPlaybackInstance={this._loadNewPlaybackInstance}
          audio={this.audio}
        />
      )
    }
  }
}
