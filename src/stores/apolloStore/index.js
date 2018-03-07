import gql from 'graphql-tag'
import { client } from '../../apollo'
import graphql from './utils'
import { types } from 'mobx-state-tree'

export const ApolloStore = types
  .model('ApolloStore')
  .views(self => ({
    get userFromToken() {
      return client.query({
        query: LOGGED_IN_USER,
        fetchPolicy: 'network-only'
      })
    }
  }))
  .actions(self => ({
    followUser: id => {
      return client.mutate({
        mutation: FOLLOW_USER,
        variables: { userId: id }
      })
    },
    updatePodcastPlay: (progress, sessionId) => {
      return client.mutate({
        mutation: UPDATE_PLAY,
        variables: { sessionId, progress }
      })
    }
  }))

const LOGGED_IN_USER = gql`
  query {
    me {
      id
      fbid
      name
    }
  }
`

const FOLLOW_USER = gql`
  mutation GetPodcast($userId: ID!) {
    followUser(userId: $userId) {
      id
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
