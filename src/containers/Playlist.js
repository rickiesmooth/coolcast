import React from 'react'
import { observer, inject } from 'mobx-react'

export const PlaylistItemComposer = PlaylistItem =>
  @inject('playlistStore')
  @observer
  class EnhancedPlaylistItem extends React.Component {
    state = {
      editing: false
    }

    removePlaylist = e => {
      this.props.playlistStore.removePlaylist(this.props.id)
    }

    editPlaylist = e => {
      this.setState({
        editing: !this.state.editing
      })
    }

    get editing() {
      return this.state.editing
    }

    render() {
      // for rerender
      this.props.episodes.length
      return (
        <PlaylistItem
          {...this.props}
          editPlaylist={this.editPlaylist}
          removePlaylist={this.removePlaylist}
          editing={this.editing}
        />
      )
    }
  }

export const CreatePlaylistComposer = CreatePlaylistComponent =>
  @inject('playlistStore', 'userStore')
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
        name: this.state.playlistName,
        author: this.props.userStore.currentUser.id
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
    addToPlaylist = (playlistId, episodeId) => {
      this.props.playlistStore.addToPlaylist(playlistId, episodeId)
      this.props.close()
    }

    render() {
      const { viewStore, apolloStore, playlistStore, ...rest } = this.props

      return (
        <AddToPlaylistComponent
          {...rest}
          name={'Create Playlist'}
          playlists={playlistStore.playlists}
          addToPlaylist={this.addToPlaylist}
        />
      )
    }
  }
