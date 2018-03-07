import React from 'react'
import { ActivityIndicator } from 'react-native'
import { observer, inject } from 'mobx-react'
import { computed } from 'mobx'

import {
  pure,
  compose,
  branch,
  renderComponent,
  withHandlers,
  mapProps
} from 'recompose'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

export const PageComposer = Page =>
  compose(
    mapProps(({ match, navigation, ...rest }) => ({
      // difference between web and native
      navigationKey: match ? match.params.id : navigation.state.params,
      ...rest
    })),
    withHandlers({
      back: ({ history, navigation }) => () =>
        history ? history.push('/') : navigation.dispatch
    }),
    pure
  )(Page)

const Loading = () => <ActivityIndicator size="large" />

const displayLoadingState = branch(
  props => props.data.loading,
  renderComponent(Loading)
)

export const HomePageComposer = Home =>
  compose(
    graphql(UserQuery),
    displayLoadingState,
    mapProps(props => {
      const { data: { loading, me, refetch } } = props
      const HistoryShows = me && me.history.shows

      // after login
      localStorage.getItem('graphcoolToken') && !me && refetch()

      return {
        playlists: me && me.playlists,
        history:
          HistoryShows &&
          HistoryShows.map(show => ({
            ...show.show,
            episodes: show.plays.map(({ progress, id, episode }) =>
              Object.assign({}, { progress, sessionId: id }, episode)
            )
          })),
        loading
      }
    }),
    pure
  )(Home)

export const ShowPageComposer = ShowPage =>
  compose(
    graphql(getShowQuery, {
      options: ({ showId }) => ({ variables: { showId } })
    }),
    displayLoadingState,
    mapProps(({ showId, data: { loading, show } }) => {
      return {
        loading,
        showId,
        ...show,
        episodes:
          show.episodes &&
          show.episodes.map(({ plays, ...rest }) => {
            if (plays && plays[0]) {
              return Object.assign(
                {},
                { progress: plays[0].progress, sessionId: plays[0].id },
                { ...rest }
              )
            } else {
              return { ...rest }
            }
          })
      }
    }),
    pure
  )(ShowPage)

export const HistoryPageComposer = HistoryPage =>
  compose(
    graphql(getHistoryQuery, {
      options: ({ showId }) => ({ variables: { showId } })
    }),
    displayLoadingState,
    mapProps(({ showId, data: { loading, me } }) => {
      const history = me.history.shows
      const show = history && history[0]
      const s = show && history[0].show
      return {
        loading,
        showId,
        ...s,
        episodes:
          show &&
          show.plays.map(({ progress, id, episode }) =>
            Object.assign({}, { progress, sessionId: id }, episode)
          )
      }
    }),
    pure
  )(HistoryPage)

export const UserQuery = gql`
  query UserQuery {
    me {
      id
      playlists {
        id
        name
        user {
          id
          name
        }
        episodes {
          id
          title
          show {
            showId
          }
        }
      }
      history {
        id
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

const getShowQuery = gql`
  query GetShow($showId: String!) {
    show(showId: $showId) {
      id
      title
      thumbLarge
      episodes {
        id
        title
        plays {
          id
          progress
        }
      }
    }
  }
`

const getHistoryQuery = gql`
  query GetPodcastHistory($showId: String!) {
    me {
      id
      history {
        id
        shows(where: { show: { showId: $showId } }) {
          id
          show {
            thumbLarge
            title
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
