import React from 'react'
import { View, Text } from 'react-native'
import { observable, computed, action } from 'mobx'
import { observer, inject } from 'mobx-react'

export const PodcastEpisodeComposer = Episode =>
  @inject('viewStore', 'podcastStore', 'apolloStore')
  @observer
  class EnhancedEpisode extends React.Component {
    @computed
    get episode() {
      const { episodeId, podcastStore } = this.props
      return podcastStore.episodes.get(episodeId)
    }

    render() {
      const { viewStore, apolloStore } = this.props
      const { title, progress, duration, liked, id, toggleLiked } = this.episode
      return (
        <Episode
          {...this.props}
          title={decodeURI(title)}
          progress={progress > 0 && progress}
          duration={duration}
          setCurrentPlaying={() => viewStore.setCurrentPlaying(this.episode.id)}
          liked={liked}
          likeApi={() => {
            toggleLiked(!liked)
            apolloStore.updateLike(liked, id)
          }}
        />
      )
    }
  }

export const PodcastShowComposer = Show =>
  @inject('podcastStore', 'viewStore')
  @observer
  class EnhancedShow extends React.Component {
    @observable episodeList = null

    @computed
    get show() {
      const { showId, podcastStore } = this.props
      const show = podcastStore.shows.get(showId)
      return show
    }

    @computed
    get episodes() {
      const { episodes, podcastStore } = this.props
      return episodes
        ? episodes.map(ep => podcastStore.episodes.get(ep))
        : this.episodeList
    }

    @action
    async getPodcastEpisodes() {
      const { showId, podcastStore } = this.props
      this.episodeList = await podcastStore.getPodcastEpisodes(showId)
    }

    componentWillMount() {
      !this.episodes && this.getPodcastEpisodes()
    }

    render() {
      const show = this.show
      if (show) {
        const { showId } = this.props
        const { title, thumbLarge } = show
        return (
          <Show
            {...this.props}
            title={title}
            episodes={this.episodes}
            thumbLarge={thumbLarge}
            showId={showId}
          />
        )
      } else {
        return <Text>Loading..</Text>
      }
    }
  }
