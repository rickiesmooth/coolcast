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
      this.audio.onloadedmetadata = () => {
        const progress = props.playerStore.currentPlaying.progress
        if (progress) {
          props.playerStore.playbackInstance.setPositionAsync(progress)
        }
      }
      this.audio.ontimeupdate = e => {
        if (this.audio.currentTime > 0) {
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
      }
    }
    async _loadNewPlaybackInstance(episode) {
      const playerStore = this.playerStore
      if (playerStore.playbackInstance != null) {
        this.audio.pause()
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
        playFromPositionAsync: progress => {
          const time = progress * this.audio.duration || 0
          this.audio.currentTime = time
          this.audio.play()
        },
        setPositionAsync: (progress = 0) => {
          this.audio.currentTime = progress * this.audio.duration || 0
          playerStore.state.shouldPlay && this.audio.play()
        }
      }
      const progress = episode.progress
      playerStore.playbackInstance.setPositionAsync(progress)

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
