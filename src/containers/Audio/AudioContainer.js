import React from 'react'

import { observable, action, computed, reaction } from 'mobx'
import { observer, inject } from 'mobx-react'

function CustomAudio(props) {
  return <audio ref={props.audioRef} />
}

const AudioContainerComposer = Player =>
  @inject('playerStore', 'viewStore', 'podcastStore')
  @observer
  class AudioContainer extends React.Component {
    disposer = reaction(
      () => this.props.viewStore.episodePlaying,
      episode => {
        !this.currentlyPlaying.sessionId && this.currentlyPlaying.getSessionId()
        this.props._loadNewPlaybackInstance(this.currentlyPlaying)
      }
    )

    componentWillUnmount() {
      this.disposer()
    }

    @computed
    get show() {
      return this.props.podcastStore.shows.get(this.currentlyPlaying.showId)
    }

    @computed
    get currentlyPlaying() {
      return this.props.podcastStore.root.currentlyPlaying
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
      const currentlyPlaying = root.currentlyPlaying
      return currentlyPlaying ? (
        <Player
          artist={this.show.title}
          title={decodeURI(currentlyPlaying.title)}
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
