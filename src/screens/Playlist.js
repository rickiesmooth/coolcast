import React from 'react'
import { Platform, ActivityIndicator } from 'react-native'
import { computed, observable, action } from 'mobx'
import { observer, inject } from 'mobx-react'
import { PlaylistItem } from '../components/Playlist'

@inject('playlistStore')
@observer
export default class PlaylistScreen extends React.Component {
  @computed
  get navigationKey() {
    const { match, navigation } = this.props
    return match ? match.params.id : navigation.state.params
  }

  render() {
    const { playlistStore } = this.props
    if (this.navigationKey) {
      const playlist = playlistStore.playlists.get(this.navigationKey)
      return playlist ? (
        <PlaylistItem
          name={playlist.name}
          id={playlist.id}
          episodes={playlist.episodes}
        />
      ) : (
        <ActivityIndicator size="large" />
      )
    }
  }
}