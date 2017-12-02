import React from 'react'

import { observable, action, computed, reaction } from 'mobx'
import { observer, inject } from 'mobx-react'

const AudioContainerComposer = Player =>
  @inject('playerStore', 'currentStore', 'podcastStore')
  @observer
  class AudioContainer extends React.Component {
    disposer = reaction(
      () => this.props.currentStore.currentPlaying,
      episode => {
        this.props.playerStore.playing = episode
        this.props._loadNewPlaybackInstance(episode)
      }
    )

    componentWillUnmount() {
      this.disposer()
    }

    render() {
      const {
        _onSeekSliderValueChange,
        _onSeekSliderSlidingComplete,
        _onPlayPausePressed,
        _getProgressPercentage,
        state
      } = this.props.playerStore
      const { playbackInstanceDuration, isLoading, isPlaying } = state
      const { currentPlaying } = this.props.currentStore
      // console.log('✨_getSeekSliderPosition', currentPlaying)
      return currentPlaying ? (
        <Player
          artist={currentPlaying.id}
          title={currentPlaying.title}
          value={_getProgressPercentage()}
          duration={playbackInstanceDuration}
          isLoading={isLoading}
          isPlaying={isPlaying}
          _onSeekSliderValueChange={_onSeekSliderValueChange}
          _onSeekSliderSlidingComplete={_onSeekSliderSlidingComplete}
          _onPlayPausePressed={_onPlayPausePressed}
        />
      ) : null
    }
  }

export default AudioContainerComposer
