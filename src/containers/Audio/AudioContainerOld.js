import React from 'react'

import {
  observable,
  action,
  computed,
  autorun,
  reaction,
  intercept
} from 'mobx'
import { observer, inject } from 'mobx-react'

const AudioContainerComposer = Player =>
  @inject('playerStore', 'currentStore', 'userStore')
  class AudioContainer extends React.Component {
    constructor(props) {
      super(props)
      const disposer = autorun(e => {
        console.log('>>>>>>', this.currentPlaying.src)
      })
      // disposer()
    }
    // disposer = reaction(
    //   () => this.currentPlaying.src,
    //   src => {
    //     this.getSessionIdandPlay(src)
    //   }
    // )
    // disposer = reaction(
    //   () => this.props.currentStore.currentPlaying.src,
    //   src => console.log('wyt')
    // )
    // disposer = intercept(this.currentPlaying, 'src', change => {
    //   this.getSessionIdandPlay(change.newValue)
    // })

    async getSessionIdandPlay(src) {
      console.log('✨fire', src)
      this.props._loadNewPlaybackInstance(src)
      // const currentStore = this.props.currentStore
      // const podcastId = this.currentPlaying.graphcoolPodcastId
      // const session = this.currentUser.history[podcastId]
      // const newSessionId = await this.props.currentStore.prepareAudioSession(
      //   this.currentUser.id,
      //   session
      // )
      // //
      // if (newSessionId) {
      //   this.props.userStore.currentUser.history[podcastId] = {
      //     id: newSessionId,
      //     progress: 0
      //   }
      // } else if (session) {
      //   this.props.playerStore.playbackInstance.setPositionAsync(
      //     session.progress
      //   )
      // }
    }

    @computed
    get currentPlaying() {
      return this.props.currentStore.currentPlaying
    }

    @computed
    get currentUser() {
      return this.props.userStore.currentUser
    }

    @computed
    get playbackInstance() {
      return this.props.playerStore.playbackInstance
    }

    _onSeekSliderValueChange = value => {
      const time = value * this.props.playerStore.state.playbackInstanceDuration
      this.props.playerStore.state.playbackInstancePosition = time
      if (this.playbackInstance != null && !this.isSeeking) {
        console.log('✨hoi', value)
        this.isSeeking = true
        this.shouldPlayAtEndOfSeek = this.props.playerStore.state.shouldPlay
        this.playbackInstance.pauseAsync()
      }
    }

    _onSeekSliderSlidingComplete = async value => {
      if (this.playbackInstance != null) {
        this.isSeeking = false
        const seekPosition =
          value * this.props.playerStore.state.playbackInstanceDuration
        console.log('✨ended', seekPosition)
        if (this.shouldPlayAtEndOfSeek) {
          this.playbackInstance.playFromPositionAsync(seekPosition)
        } else {
          this.playbackInstance.setPositionAsync(seekPosition)
        }
      }
    }

    _getSeekSliderPosition() {
      if (
        this.playbackInstance != null &&
        this.props.playerStore.state.playbackInstancePosition != null &&
        this.props.playerStore.state.playbackInstanceDuration != null
      ) {
        return (
          this.props.playerStore.state.playbackInstancePosition /
          this.props.playerStore.state.playbackInstanceDuration
        )
      }
      return 0
    }

    render() {
      const showTitle = this.props.currentStore.currentPodcastEpisodeMeta.title
      return this.currentPlaying.title ? (
        <Player
          artist={showTitle}
          title={this.currentPlaying.title}
          value={this._getSeekSliderPosition()}
          duration={this.props.playerStore.state.playbackInstanceDuration}
          isLoading={this.props.playerStore.state.isLoading}
          isPlaying={this.props.playerStore.state.isPlaying}
          _onSeekSliderValueChange={this._onSeekSliderValueChange}
          _onSeekSliderSlidingComplete={this._onSeekSliderSlidingComplete}
          _onPlayPausePressed={this.props.playerStore._onPlayPausePressed}
        />
      ) : null
    }
  }

export default AudioContainerComposer
