import React from 'react'

import { observable, action, computed, reaction } from 'mobx'
import { observer, inject } from 'mobx-react'

function CustomAudio(props) {
  return <audio ref={props.audioRef} />
}

const AudioContainerComposer = Player =>
  @inject('playerStore')
  @observer
  class AudioContainer extends React.Component {
    disposer = reaction(
      () => this.props.playerStore.currentPlaying,
      episode => {
        this.props._loadNewPlaybackInstance(episode)
      }
    )

    componentWillUnmount() {
      this.disposer()
    }

    @computed
    get currentPlaying() {
      return this.props.playerStore.currentPlaying
    }

    render() {
      const {
        onPlayPausePressed,
        progressPercentage,
        onSeekSliderValueChange,
        onSeekSliderSlidingComplete,
        state,
        root
      } = this.props.playerStore
      const { playbackInstanceDuration, isLoading, isPlaying } = state
      const currentPlaying = this.currentPlaying
      return currentPlaying ? (
        <Player
          artist={decodeURI(currentPlaying.title)}
          title={decodeURI(currentPlaying.title)}
          progress={progressPercentage}
          duration={playbackInstanceDuration}
          isLoading={isLoading}
          isPlaying={isPlaying}
          onSeekSliderValueChange={onSeekSliderValueChange}
          onSeekSliderSlidingComplete={onSeekSliderSlidingComplete}
          onPlayPausePressed={onPlayPausePressed}
        >
          {this.props.children}
        </Player>
      ) : null
    }
  }

export default AudioContainerComposer
