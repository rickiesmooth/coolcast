import { types, getRoot } from 'mobx-state-tree'

const PlaybackState = types.model({
  playbackInstancePosition: types.number,
  playbackInstanceDuration: types.number,
  shouldPlay: types.boolean,
  isPlaying: types.boolean,
  isBuffering: types.boolean,
  isLoading: types.boolean,
  volume: types.number,
  rate: types.number
})

export const PlayerStore = types
  .model({
    isSeeking: false,
    shouldPlayAtendOfSeek: false,
    state: PlaybackState
  })
  .views(self => ({
    get root() {
      return getRoot(self)
    },
    get progressPercentage() {
      const state = self.state
      return (
        state.playbackInstancePosition / state.playbackInstanceDuration || 0
      )
    }
    // get secondsFromPercentage() {
    //   console.log(
    //     '✨this.props.playerStore.state.durationMillis',
    //     self.state.durationMillis
    //   )
    //   return self.state
    // }
  }))
  .actions(self => ({
    onPlayPausePressed() {
      if (self.playbackInstance != null) {
        if (self.state.isPlaying) {
          self.playbackInstance.pauseAsync()
        } else {
          self.playbackInstance.playAsync()
        }
      }
    },
    onSeekSliderSlidingComplete(value) {
      if (self.playbackInstance != null) {
        self.isSeeking = false
        const seekPosition = value * self.state.playbackInstanceDuration
        if (self.shouldPlayAtEndOfSeek) {
          self.playbackInstance.playFromPositionAsync(seekPosition)
        } else {
          self.playbackInstance.setPositionAsync(seekPosition)
        }
      }
    },
    onSeekSliderValueChange(value) {
      const {
        playbackInstanceDuration,
        playbackInstancePosition,
        shouldPlay
      } = self.state

      const time = value * playbackInstanceDuration
      self.state.playbackInstancePosition = time

      if (self.playbackInstance != null && !self.isSeeking) {
        self.isSeeking = true
        self.shouldPlayAtEndOfSeek = shouldPlay
        self.playbackInstance.pauseAsync()
      }
    },
    sendProgress: throttle(progress => {
      const { currentlyPlaying, apolloStore } = self.root
      if (currentlyPlaying) {
        apolloStore.updatePodcastPlay(progress, currentlyPlaying.sessionId)
      }
    }, 10e3),
    onPlaybackStatusUpdate(status) {
      if (status.isLoaded) {
        self.state = {
          playbackInstancePosition: status.positionMillis,
          playbackInstanceDuration: status.durationMillis,
          shouldPlay: status.shouldPlay,
          isPlaying: status.isPlaying,
          isLoading: !status.isBuffering,
          isBuffering: status.isBuffering,
          rate: status.rate,
          volume: status.volume
        }
        const progressPercentage = self.progressPercentage
        self.root.currentlyPlaying.setProgress(progressPercentage)
        self.sendProgress(progressPercentage)
        if (status.didJustFinish) {
          self.playbackInstance.stopAsync()
        }
      } else {
        if (status.error) {
          console.log(`FATAL PLAYER ERROR: ${status.error}`)
        }
      }
    },
    updateScreenForLoading(isLoading) {
      if (isLoading) {
        self.state.isPlaying = false
        self.state.playbackInstanceDuration = null
        self.state.playbackInstancePosition = null
        self.state.isLoading = true
      } else {
        self.state.isLoading = false
      }
    }
  }))

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
