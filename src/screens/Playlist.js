import React from 'react'
import { Text } from 'react-native'
import { PlaylistItem } from '../components/Playlist'
import { PageComposer } from '../containers/Page'
import { PlaylistPageComposer } from '../containers/Playlist'

const PlaylistWithData = props => {
  const { navigationKey, data: { loading, playlist } } = props
  if (loading) {
    return <Text>Loading</Text>
  } else {
    return <PlaylistItem playlistId={navigationKey} {...playlist} />
  }
}

const Test = PlaylistPageComposer(PlaylistWithData)

export default PageComposer(Test)
