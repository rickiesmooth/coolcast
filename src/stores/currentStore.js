import { observable, action } from 'mobx'
import gql from 'graphql-tag'
import client from '../apollo'
export default class CurrentStore {
  @observable currentPodcast = null
  @observable currentPlaying = null
  @observable hideSearchResults = false

  @action
  async setCurrentPlaying(episode) {
    if (!episode.plays) {
      const plays = await client.mutate({
        mutation: CREATE_PODCAST_PLAY,
        variables: { episodeId: episode.id }
      })
      episode.plays = plays.data.AddPlay
    }
    this.currentPlaying = episode
  }

  @action setCurrentPodcast = ({ key }) => (this.currentPodcast = key)
}

const CREATE_PODCAST_PLAY = gql`
  mutation CreatePodcastPlay($episodeId: ID!) {
    AddPlay(episodeId: $episodeId) {
      id
      progress
    }
  }
`
