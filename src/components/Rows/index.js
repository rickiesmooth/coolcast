import React from 'react'
import { View, StyleSheet, Text } from 'react-native'

import { RowContainer } from '../Views'

import { HistoryComponent } from './History'
import { PlaylistComponent } from './Playlist'
import { HomePageComposer } from '../../containers/Page'

const HomeRowsPure = props => {
  const { playlists, history } = props
  console.log('✨history', history)
  return (
    <RowContainer>
      <HistoryComponent horizontal={true} shows={history} />
      <PlaylistComponent horizontal={true} playlists={playlists} />
    </RowContainer>
  )
}

export const HomeRows = HomePageComposer(HomeRowsPure)

// get by ShowId
// get by episodeId
