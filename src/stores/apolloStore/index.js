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
    }
  }))
  .actions(self => ({
    getPlaylist: id => {
      console.log('✨id>>', id)
      return client.query({
        query: GET_PLAYLIST,
        variables: { playlistId: id }
      })
    },
    getUser: userId =>
      client.query({
        query: GET_USER,
        variables: { userId }
      }),
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
      console.log('✨getGraphCoolShow key', key)
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
    createPodcastPlay: ({ episodeId, showId, sessionId }) =>
      client.mutate({
        mutation: CREATE_PLAY,
        variables: { episodeId, showId, sessionId }
      }),
    updatePodcastPlay: (progress, sessionId) => {
      console.log('✨progress, sessionId', progress, sessionId)
      return client.mutate({
        mutation: UPDATE_PLAY,
        variables: { sessionId, progress }
      })
    },
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
// ;('cjdn4owjt3k0w0158r6ccg4l7')
const LOGGED_IN_USER = gql`
  query {
    me {
      id
      email
      fbid
      name
      playlists {
        id
        name
        episodes {
          id
          title
          show {
            showId
          }
        }
      }
      history {
        shows {
          show {
            id
            title
            thumbLarge
            showId
          }
          plays {
            id
            progress
            episode {
              id
              title
            }
          }
        }
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
      }
    }
  }
`
GET_USER = gql`
  query GetUser($userId: ID!) {
    user(userId: $userId) {
      id
      name
      fbid
    }
  }
`

const GET_PLAYLIST = gql`
  query GetPlaylist($playlistId: ID!) {
    playlists(id: $playlistId) {
      id
      name
      user {
        id
        name
        fbid
      }
      episodes {
        id
        title
      }
    }
  }
`

const SHOW_EPISODES = gql`
  query GetPodcast($id: ID!) {
    shows(id: $id) {
      id
      thumbLarge
      title
      episodes {
        id
        title
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

const REMOVE_PLAYLIST = gql`
  mutation RemovePlaylist($id: ID!) {
    removePlaylist(id: $id) {
      id
    }
  }
`

const CREATE_PLAY = gql`
  mutation CreatePodcastPlay(
    $episodeId: ID!
    $showId: String!
    $sessionId: ID
  ) {
    addPlay(episodeId: $episodeId, showId: $showId, sessionId: $sessionId) {
      id
      progress
      episode {
        id
        src
      }
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
