import React from 'react'
import { ActivityIndicator } from 'react-native'
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

    get hasEpisodes() {
      return (
        this.playlist && this.playlist.episodes && this.playlist.episodes.length
      )
    }

    get playlist() {
      return this.props.playlistStore.playlists.get(this.props.id)
    }

    componentDidMount() {
      const { id, playlistStore } = this.props
      if (!this.playlist) {
        // there is no playlist yet > when landing
        playlistStore.getPlaylist({ playlistId: id })
      } else if (this.playlist && !this.playlist.episodes) {
        // there is a playlist but no episodes yet > when navigation from home
        playlistStore.getPlaylistEpisodes(this.show)
      }
    }

    render() {
      return this.playlist ? (
        <PlaylistItem
          {...this.props}
          {...this.playlist}
          editPlaylist={this.editPlaylist}
          removePlaylist={this.removePlaylist}
          editing={this.editing}
          hasEpisodes={this.hasEpisodes}
        />
      ) : (
        <ActivityIndicator size={'large'} />
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
          name={'Enter playlist name'}
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
