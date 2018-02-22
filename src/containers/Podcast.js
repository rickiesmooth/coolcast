import React from 'react'
import { View, Text } from 'react-native'
import { observable, computed, action } from 'mobx'
import { observer, inject } from 'mobx-react'

export const PodcastEpisodeComposer = Episode =>
  @inject('playerStore', 'playlistStore', 'podcastStore')
  @observer
  class EnhancedEpisode extends React.Component {
    @computed
    get episode() {
      const { episodeId, podcastStore } = this.props
      return podcastStore.episodes.get(episodeId)
    }

    addToPlaylist = () => {
      console.log('✨adding tp playlist')
      this.props.playlistStore.addToPlaylist(this.episode.id)
    }

    render() {
      const { playerStore } = this.props
      const {
        title,
        progress,
        duration,
        likeId,
        id,
        toggleLiked
      } = this.episode
      return (
        <Episode
          {...this.props}
          title={decodeURI(title)}
          id={id}
          progress={progress > 0 && progress}
          duration={duration}
          setCurrentPlaying={() => playerStore.setCurrentPlaying(this.episode)}
          liked={likeId}
          likeApi={() => toggleLiked(likeId)}
          playlistApi={this.addToPlaylist}
        />
      )
    }
  }

export const PodcastShowComposer = Show =>
  @inject('podcastStore')
  @observer
  class EnhancedShow extends React.Component {
    @computed
    get show() {
      const { showId, podcastStore } = this.props
      return podcastStore.shows.get(showId)
    }

    @computed
    get episodes() {
      const { episodes, podcastStore, showId } = this.props
      return episodes ? episodes : this.show && this.show.episodes
    }

    componentDidMount() {
      const { showId, podcastStore, episodes } = this.props
      if (!episodes) {
        // the episodes are not yet added from history > not on homepage
        if (!this.show) {
          // there is no show yet > when landing
          podcastStore.getShow(showId)
        } else if (this.show && !this.show.episodes) {
          // there is a show but no episodes yet > when navigation from home
          podcastStore.getEpisodes(this.show)
        }
      }
    }

    render() {
      const show = this.show
      const { showId } = this.props
      return (
        <Show
          {...this.props}
          title={(show && show.title) || ''}
          episodes={this.episodes || []}
          thumbLarge={(show && show.thumbLarge) || ''}
          showId={showId}
          loading={!show}
        />
      )
    }
  }
