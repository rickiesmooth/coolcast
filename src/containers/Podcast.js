import React from 'react'
import { View, Text } from 'react-native'
import { observable, computed, action } from 'mobx'
import { observer, inject } from 'mobx-react'

import { fromPromise } from 'mobx-utils'

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
    @computed
    get show() {
      const { showId, podcastStore } = this.props
      return fromPromise(podcastStore.getShow(showId))
    }

    @computed
    get episodes() {
      const { episodes, podcastStore } = this.props
      return episodes ? episodes.map(ep => podcastStore.episodes.get(ep)) : null
    }

    render() {
      const show = this.show
      const { showId } = this.props
      switch (show.state) {
        case 'pending':
          return <Text>Loading..</Text>
        case 'rejected':
          return <Text>Error... {show.value}</Text>
        case 'fulfilled':
          return (
            <Show
              {...this.props}
              title={show.value.title}
              episodes={this.episodes || show.value.episodes}
              thumbLarge={show.value.thumbLarge}
              showId={showId}
            />
          )
      }
    }
  }
