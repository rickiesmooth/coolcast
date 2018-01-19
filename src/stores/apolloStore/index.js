import gql from 'graphql-tag'
import { client } from '../../apollo'
import graphql from './utils'
import { types, getRoot } from 'mobx-state-tree'

export const ApolloStore = types
  .model('ApolloStore', {
    client: types.string
  })
  .views(self => ({
    get root() {
      return getRoot(self)
    },
    get userHistory() {
      return client.query({
        query: USER_HISTORY
      })
    },
    get userFromToken() {
      return client.query({
        query: LOGGED_IN_USER,
        fetchPolicy: 'network-only'
      })
    }
  }))
  .actions(self => ({
    getGraphCoolShow: async key => {
      client.mutate({
        mutation: GET_PODCAST,
        variables: {
          showId: parseInt(key)
        }
      })
    },
    // https://github.com/graphcool/framework/issues/743
    getEpisodesFromGraphcool: id =>
      client.query({
        query: SHOW_EPISODES,
        variables: { showId }
      }),
    createPodcastPlay: episodeId =>
      client.mutate({
        mutation: CREATE_PODCAST_PLAY,
        variables: { episodeId }
      }),
    updatePodcastPlay: (progress, viewId) =>
      client.mutate({
        mutation: UPDATE_PODCAST_PLAY,
        variables: { viewId, progress }
      }),
    updateLike: (liked, episodeId) => {
      console.log('✨e', episodeId, self.root.userStore.currentUser)
      return client.mutate({
        mutation: CREATE_PODCAST_PLAY,
        variables: { episodeId, liked }
      })
    },
    userFromFBToken: facebookToken => {
      return client.mutate({
        mutation: LOGIN_OR_SIGNUP,
        variables: { facebookToken }
      })
    }
  }))

const LOGGED_IN_USER = gql`
  query {
    user {
      id
      email
      facebookUserId
    }
  }
`

const USER_HISTORY = gql`
  query {
    user {
      id
      likedEpisodes {
        title
        id
        src
        duration
        show {
          id
          showId
        }
      }
      history {
        id
        progress
        episode {
          title
          id
          src
          duration
          show {
            id
            showId
          }
        }
      }
    }
  }
`

const GET_PODCAST = gql`
  mutation GetPodcastdandCheckIfNew($showId: Int!) {
    getPodcast(showId: $showId) {
      graphcoolPodcastId
      newPodcast
    }
  }
`

const SHOW_EPISODES = gql`
  query ShowEpisodes($id: ID!) {
    Show(id: $id) {
      episodes {
        id
        src
        description
        duration
        title
      }
    }
  }
`

const UPDATE_LIKE = gql`
  mutation CreateLikeMutation($episodeId: ID!) {
    addToLikedEpisodes(likedEpisodesEpisodeId: $episodeId) {
      likedEpisodesEpisode {
        id
      }
    }
  }
`

const CREATE_PODCAST_PLAY = gql`
  mutation CreatePodcastPlay($episodeId: ID!) {
    AddPlay(episodeId: $episodeId) {
      id
      progress
    }
  }
`

const CREATE_PODCAST_LIKE = gql`
  mutation CreatePodcastPlay($episodeId: ID!) {
    AddLike(episodeId: $episodeId) {
      id
      progress
    }
  }
`

const LOGIN_OR_SIGNUP = gql`
  mutation LoginOrSignup($facebookToken: String!) {
    authenticate(facebookToken: $facebookToken) {
      user {
        id
        email
        facebookUserId
      }
      token
    }
  }
`
