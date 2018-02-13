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
    get userFromToken() {
      return client.query({
        query: LOGGED_IN_USER,
        fetchPolicy: 'network-only'
      })
    },
    get userHistory() {
      return client.query({
        query: USER_HISTORY,
        fetchPolicy: 'network-only'
      })
    }
  }))
  .actions(self => ({
    getEpisodes: id =>
      client.query({
        query: SHOW_EPISODES,
        variables: { id }
      }),
    addToPlaylist: (playlistId, episodeId) =>
      client.mutate({
        mutation: UPDATE_PLAYLIST,
        variables: { playlistId, episodeId }
      }),
    getGraphCoolShow: async key => {
      console.log('✨key', key)
      return client.mutate({
        mutation: GET_PODCAST,
        variables: {
          showId: key
        }
      })
    },
    addPlaylist: ({ name }) =>
      client.mutate({
        mutation: ADD_PLAYLIST,
        variables: { name }
      }),
    removePlaylist: id =>
      client.mutate({
        mutation: REMOVE_PLAYLIST,
        variables: { id }
      }),
    createPodcastPlay: episodeId =>
      client.mutate({
        mutation: CREATE_PLAY,
        variables: { episodeId }
      }),
    updatePodcastPlay: (progress, sessionId) =>
      client.mutate({
        mutation: UPDATE_PLAY,
        variables: { sessionId, progress }
      }),
    updateLike: (episodeId, likeId) =>
      client.mutate({
        mutation: UPDATE_LIKE,
        variables: { episodeId, likeId }
      }),
    userFromFBToken: facebookToken =>
      client.mutate({
        mutation: LOGIN_OR_SIGNUP,
        variables: { facebookToken }
      })
  }))

const LOGGED_IN_USER = gql`
  query {
    me {
      id
      email
      fbid
      name
      likes {
        id
        episode {
          id
          show {
            showId
          }
        }
      }
      playlists {
        id
        name
        episodes {
          id
        }
      }
      history {
        id
        progress
        episode {
          id
          show {
            showId
          }
        }
      }
    }
  }
`

const USER_HISTORY = gql`
  query {
    userHistoryShows {
      showId
      title
      thumbLarge
      id
    }
    userHistoryEpisodes {
      id
      title
      src
      show {
        showId
      }
    }
  }
`

const GET_PODCAST = gql`
  mutation GetPodcast($showId: String!) {
    getPodcast(showId: $showId) {
      id
      thumbLarge
      title
      episodes {
        id
        title
        src
      }
    }
  }
`

// graphcoolPodcastId
// newPodcast

const SHOW_EPISODES = gql`
  query GetPodcast($id: ID!) {
    shows(id: $id) {
      id
      thumbLarge
      title
      episodes {
        id
        title
        src
      }
    }
  }
`
const ADD_PLAYLIST = gql`
  mutation AddPlaylist($name: String!) {
    addPlaylist(name: $name) {
      id
    }
  }
`
const UPDATE_PLAYLIST = gql`
  mutation UpdatePlaylist($playlistId: ID!, $episodeId: ID!) {
    updatePlaylist(playlistId: $playlistId, episodeId: $episodeId) {
      id
    }
  }
`

REMOVE_PLAYLIST = gql`
  mutation RemovePlaylist($id: ID!) {
    removePlaylist(id: $id) {
      id
    }
  }
`

const CREATE_PLAY = gql`
  mutation CreatePodcastPlay($episodeId: ID!) {
    addPlay(episodeId: $episodeId) {
      id
      progress
    }
  }
`
const UPDATE_PLAY = gql`
  mutation updatePlay($sessionId: ID!, $progress: Float!) {
    updatePlay(sessionId: $sessionId, progress: $progress) {
      id
    }
  }
`
const UPDATE_LIKE = gql`
  mutation UpdatePodcastLike($episodeId: ID!, $likeId: ID) {
    updateLike(episodeId: $episodeId, likeId: $likeId) {
      id
    }
  }
`

const LOGIN_OR_SIGNUP = gql`
  mutation LoginOrSignup($facebookToken: String!) {
    authenticate(facebookToken: $facebookToken) {
      user {
        id
        email
        fbid
      }
      token
    }
  }
`
