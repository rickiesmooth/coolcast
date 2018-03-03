import React from 'react'
import { observer, inject } from 'mobx-react'

import { pure, compose, withHandlers, mapProps } from 'recompose'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

const mutation = gql`
  mutation makePlay($episodeId: ID!, $showId: String!, $sessionId: ID) {
    addPlay(episodeId: $episodeId, showId: $showId, sessionId: $sessionId) {
      id
      episode {
        src
      }
    }
  }
`

export const PodcastEpisodeComposer = Episode => {
  return compose(
    inject('playerStore'),
    observer,
    graphql(mutation),
    mapProps(({ playerStore, episodeId, ...rest }) => ({
      get isCurrentlyPlaying() {
        return (
          playerStore.currentPlaying &&
          playerStore.currentPlaying.id === episodeId
        )
      },
      episodeId,
      playerStore,
      ...rest
    })),
    withHandlers({
      createPlay: props => {
        const { mutate, episodeId, showId, sessionId, src, progress } = props
        return async () => {
          const cp = { id: episodeId, src, sessionId, progress }
          if (!sessionId || !src) {
            const res = await mutate({
              variables: { episodeId, showId, sessionId }
            })
            cp.sessionId = res.data.addPlay.id
            cp.src = res.data.addPlay.episode.src
          }
          props.playerStore.setCurrentPlaying(cp)
        }
      }
    })
  )(Episode)
}
