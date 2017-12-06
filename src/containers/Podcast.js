import React from 'react'
import { View, Text } from 'react-native'
import { observable, computed, action } from 'mobx'
import { observer, inject } from 'mobx-react'

export const PodcastEpisodeComposer = Episode =>
  @inject('currentStore', 'podcastStore')
  @observer
  class EnhancedEpisode extends React.Component {
    @computed
    get episode() {
      const { episodeId, podcastStore } = this.props
      return podcastStore.episodes[episodeId]
    }

    render() {
      const { currentStore } = this.props
      const { title, plays } = this.episode

      return (
        <Episode
          {...this.props}
          title={decodeURI(title)}
          progress={plays && plays.progress}
          setCurrentPlaying={() => currentStore.setCurrentPlaying(this.episode)}
        />
      )
    }
  }

export const PodcastShowComposer = Show =>
  @inject('currentStore', 'podcastStore')
  @observer
  class EnhancedShow extends React.Component {
    @observable episodeList = null
    @observable showMeta = null

    @computed
    get show() {
      const { showId, podcastStore } = this.props
      const show = podcastStore.shows[showId]
      !show && this.getPodcastShowMeta()
      return show
    }

    @computed
    get episodes() {
      const { episodes } = this.props
      !episodes && this.getPodcastEpisodes()
      return episodes
    }

    @action
    async getPodcastShowMeta() {
      const { showId, podcastStore } = this.props
      this.showMeta = await podcastStore.getCurrentPodcast({ key: showId })
    }

    @action
    async getPodcastEpisodes() {
      const { showId, podcastStore, currentStore } = this.props
      const history = currentStore.currentUserHistory
      this.episodeList = await podcastStore.getPodcastEpisodes(showId, history)
    }

    render() {
      const { showId, podcastStore } = this.props
      const show = this.show || this.showMeta
      if (show) {
        const { title, episodes, thumbLarge } = show
        return (
          <Show
            {...this.props}
            title={title}
            episodes={this.episodes || this.episodeList}
            thumbLarge={thumbLarge}
            showId={this.props.showId}
          />
        )
      } else {
        return <Text>Loading..</Text>
      }
    }
  }
