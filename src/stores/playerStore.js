import { observable, action, computed } from 'mobx'
import client from '../apollo'
import gql from 'graphql-tag'

export default class PlayerStore {
  @observable isSeeking = false
  @observable shouldPlayAtEndOfSeek = false
  @observable
  state = {
    playbackInstancePosition: null,
    playbackInstanceDuration: null,
    shouldPlay: false,
    isPlaying: false,
    isBuffering: false,
    isLoading: true,
    thumb: null,
    volume: 1.0,
    rate: 1.0
  }

  playbackInstance = null

  playing = {}

  _onPlayPausePressed = () => {
    if (this.playbackInstance != null) {
      if (this.state.isPlaying) {
        this.playbackInstance.pauseAsync()
      } else {
        this.playbackInstance.playAsync()
      }
    }
  }

  _getProgressPercentage = () => {
    if (
      this.playbackInstance != null &&
      this.state.playbackInstancePosition != null &&
      this.state.playbackInstanceDuration != null
    ) {
      return (
        this.state.playbackInstancePosition /
        this.state.playbackInstanceDuration
      )
    }
    return 0
  }

  @action
  sendProgress = throttle(async progress => {
    if (this.playing) {
      this.playing.plays.progress = progress
      const result = await client.mutate({
        mutation: UPDATE_PODCAST_PLAY,
        variables: {
          viewId: this.playing.plays.id,
          progress
        }
      })
    }
  }, 10e3)

  @action
  _onPlaybackStatusUpdate = status => {
    if (status.isLoaded) {
      this.playing.plays.progress = status.positionMillis
      this.state = {
        playbackInstancePosition: status.positionMillis,
        playbackInstanceDuration: status.durationMillis,
        shouldPlay: status.shouldPlay,
        isPlaying: status.isPlaying,
        isBuffering: status.isBuffering,
        rate: status.rate,
        volume: status.volume
      }
      this.sendProgress(status.positionMillis)
      if (status.didJustFinish) {
        this.playbackInstance.stopAsync()
      }
    } else {
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`)
      }
    }
  }

  @action
  _updateScreenForLoading(isLoading) {
    if (isLoading) {
      this.state.isPlaying = false
      this.state.playbackInstanceDuration = null
      this.state.playbackInstancePosition = null
      this.state.isLoading = true
    } else {
      this.state.isLoading = false
    }
  }
}

const UPDATE_PODCAST_PLAY = gql`
  mutation UpdatePodcastPlay($viewId: ID!, $progress: Float!) {
    updatePodcastPlay(id: $viewId, progress: $progress) {
      id
    }
  }
`

function throttle(callback, wait, context = this) {
  let timeout = null
  let callbackArgs = null

  const later = () => {
    callback.apply(context, callbackArgs)
    timeout = null
  }

  return function() {
    if (!timeout) {
      callbackArgs = arguments
      timeout = setTimeout(later, wait)
    }
  }
}
