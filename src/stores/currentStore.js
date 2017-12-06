import { observable, action, computed } from 'mobx'
import { AsyncStorage } from 'react-native'
import gql from 'graphql-tag'
import client from '../apollo'
export default class CurrentStore {
  constructor() {
    this.getFromToken()
  }
  @observable currentPodcast = null
  @observable currentPlaying = null
  @observable
  currentUser = {
    id: null,
    history: null
  }

  @action
  async setCurrentPlaying(episode) {
    if (!episode.plays.id) {
      const plays = await client.mutate({
        mutation: CREATE_PODCAST_PLAY,
        variables: { episodeId: episode.id }
      })
      episode.plays = plays.data.AddPlay
    }
    this.currentPlaying = episode
  }

  @action setCurrentPodcast = ({ key }) => (this.currentPodcast = key)

  @action
  async getFromToken() {
    const token = await AsyncStorage.getItem('graphcoolToken')
    if (token) {
      const graphcoolResponse = await client.query({
        query: LOGGED_IN_USER,
        fetchPolicy: 'network-only'
      })
      const user = graphcoolResponse.data.user
      this.setCurrentUser(user)
    }
  }

  @action
  async setCurrentUser(user) {
    if (user) {
      this.currentUser = {
        facebookUserId: user.facebookUserId,
        id: user.id,
        email: user.email,
        history: user.history
      }
    }
  }

  @computed
  get currentUserHistory() {
    if (this.currentUser.history) {
      return this.currentUser.history.reduce((r, a) => {
        const { id, title, src, show } = a.episode
        r[id] = {
          id,
          title,
          src,
          show: show[0],
          plays: {
            id: a.id,
            progress: a.progress
          }
        }
        return r
      }, {})
    }
  }
}

const CREATE_PODCAST_PLAY = gql`
  mutation CreatePodcastPlay($episodeId: ID!) {
    AddPlay(episodeId: $episodeId) {
      id
      progress
    }
  }
`

const LOGGED_IN_USER = gql`
  query {
    user {
      id
      email
      facebookUserId
      history {
        id
        progress
        episode {
          title
          id
          src
          show {
            id
            showId
          }
        }
      }
    }
  }
`
