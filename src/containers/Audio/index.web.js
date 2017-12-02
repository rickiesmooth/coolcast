import React from 'react'
import AudioContainerComposer from './AudioContainer'

export default Player => {
  return class Enhanced extends React.Component {
    constructor(props) {
      super()
      this.audioTag = document.createElement('audio')
    }
    _setStream = (src, playerStore) => {
      this.audioTag.src = src
      this.audioTag.ontimeupdate = () => {
        playerStore._onPlaybackStatusUpdate({
          positionMillis: this.audioTag.currentTime / 1000,
          isLoaded: true,
          durationMillis: this.audioTag.duration / 1000,
          shouldPlay: true,
          isPlaying: !this.audioTag.paused,
          isBuffering: false,
          rate: 1,
          volume: 1
        })
      }
      return {
        unloadAsync: () => {
          this.audioTag.src = ''
          this.audioTag.load()
        },
        pauseAsync: playing => {
          this.audioTag.pause()
        },
        playAsync: () => {
          this.audioTag.play()
        },
        playFromPositionAsync: time => {
          this.audioTag.currentTime = time * 1000
          this.audioTag.play()
        },
        setPositionAsync: time => {
          if (!this.audioTag.duration) {
            this.audioTag.onloadedmetadata = () => {
              this.audioTag.currentTime = audioTag.duration / 100 * time
            }
          } else {
            this.audioTag.currentTime = audioTag.duration / 100 * time
          }
        }
      }
    }
    async _loadNewPlaybackInstance(episode) {
      const playerStore = this.playerStore
      if (playerStore.playbackInstance != null) {
        await playerStore.playbackInstance.unloadAsync()
        playerStore.playbackInstance = null
      }

      const sound = this._setStream(episode.src, this.playerStore)
      playerStore.playbackInstance = sound
      const session = episode.plays
      if (session && session.progress) {
        playerStore.playbackInstance.playFromPositionAsync(session.progress)
      } else {
        playerStore.playbackInstance.playAsync()
      }
      playerStore._updateScreenForLoading(false)
    }
    render() {
      const Container = AudioContainerComposer(Player)
      return (
        <Container
          {...this.props}
          _loadNewPlaybackInstance={this._loadNewPlaybackInstance}
          _setStream={this._setStream}
        />
      )
    }
  }
}
