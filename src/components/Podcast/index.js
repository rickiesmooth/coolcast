import React from 'react'
import { ActivityIndicator } from 'react-native'

import { pure, compose } from 'recompose'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { ShowItem } from './ShowItem'
import { EpisodeItem } from './EpisodeItem'

const ShowScreenPure = ({ showId, data: { loading, show } }) => {
  if (loading) {
    return <ActivityIndicator size="large" />
  } else {
    const { episodesWithPlays, ...rest } = show
    return <ShowItem showId={showId} {...rest} episodes={episodesWithPlays} />
  }
}

const HistoryScreenPure = ({ showId, data: { loading, me } }) => {
  if (loading) {
    return <ActivityIndicator size="large" />
  } else {
    const { onlyEpisodesWithHistory, ...rest } = me.history.shows[0].show
    return (
      <ShowItem showId={showId} episodes={onlyEpisodesWithHistory} {...rest} />
    )
  }
}

const show = graphql(
  gql`
    query GetPodcast($showId: String!) {
      show(showId: $showId) {
        id
        thumbLarge
        title
        episodesWithPlays {
          id
          title
          plays {
            progress
            id
          }
        }
      }
    }
  `,
  {
    options: props => ({
      variables: { showId: props.showId }
    })
  }
)

const history = graphql(
  gql`
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
              onlyEpisodesWithHistory {
                id
                title
                plays {
                  id
                  progress
                }
              }
            }
          }
        }
      }
    }
  `,
  {
    options: props => ({
      variables: { showId: props.showId }
    })
  }
)

export const HistoryScreen = compose(history, pure)(HistoryScreenPure)
export const ShowScreen = compose(show, pure)(ShowScreenPure)

export { ShowItem }
export { EpisodeItem }
