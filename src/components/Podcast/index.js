import React from 'react'
import { ActivityIndicator } from 'react-native'

import { ShowPageComposer, HistoryPageComposer } from '../../containers/Page'
import { ShowItem } from './ShowItem'
import { EpisodeItem } from './EpisodeItem'

const ShowScreenPure = ({ loading, ...rest }) =>
  loading ? <ActivityIndicator size="large" /> : <ShowItem {...rest} />

const HistoryScreenPure = props => {
  const { showId, loading, episodes, ...rest } = props
  if (loading) {
    return <ActivityIndicator size="large" />
  } else {
    console.log('✨props', props)
    return <ShowItem showId={showId} episodes={episodes} {...rest} />
    return null
  }
}

export const ShowScreen = ShowPageComposer(ShowScreenPure)

export const HistoryScreen = HistoryPageComposer(HistoryScreenPure)
// compose(history, pure)(HistoryScreenPure)

export { ShowItem }
export { EpisodeItem }
