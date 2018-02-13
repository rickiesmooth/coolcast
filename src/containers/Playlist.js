import React from 'react'
import { observer, inject } from 'mobx-react'

export const PlaylistItemComposer = PlaylistItem =>
  @inject('playlistStore')
  @observer
  class EnhancedButton extends React.Component {
    removePlaylist = e => {
      this.props.playlistStore.removePlaylist(this.props.id)
    }

    render() {
      const { viewStore, apolloStore } = this.props

      return (
        <PlaylistItem {...this.props} removePlaylist={this.removePlaylist} />
      )
    }
  }

export const CreatePlaylistComposer = CreatePlaylistComponent =>
  @inject('playlistStore')
  @observer
  class EnhancedButton extends React.Component {
    state = {
      playlistName: null
    }

    updateName = playlistName => {
      this.setState({ playlistName })
    }

    submitPlaylist = e => {
      this.props.close(e)
      this.props.playlistStore.addPlaylist({
        name: this.state.playlistName
      })
    }

    render() {
      const { viewStore, apolloStore, ...rest } = this.props
      return (
        <CreatePlaylistComponent
          {...rest}
          name={'Create Playlist'}
          submit={this.submitPlaylist}
          update={this.updateName}
        />
      )
    }
  }

export const AddToPlaylistComposer = AddToPlaylistComponent =>
  @inject('playlistStore', 'apolloStore')
  @observer
  class EnhancedButton extends React.Component {
    get playlists() {
      return this.props.playlistStore.playlists.values()
    }

    addToPlaylist = (playlistId, episodeId) => {
      this.props.playlistStore.addToPlaylist(playlistId, episodeId)
    }

    render() {
      const { viewStore, apolloStore, ...rest } = this.props

      return (
        <AddToPlaylistComponent
          {...rest}
          name={'Create Playlist'}
          playlists={this.playlists}
          addToPlaylist={this.addToPlaylist}
        />
      )
    }
  }
