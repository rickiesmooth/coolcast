import React from 'react'
import { observer, inject } from 'mobx-react'
import { computed } from 'mobx'

export const HistoryRowComposer = HistoryRow =>
  @inject('podcastStore', 'userStore')
  @observer
  class Enhanced extends React.Component {
    @computed
    get hasHistory() {
      return this.props.userStore.hasHistory
    }
    @computed
    get shows() {
      return this.props.userStore.groupedUserHistory
    }

    render() {
      return (
        <HistoryRow
          {...this.props}
          hasHistory={this.hasHistory}
          title={'Continue listenling'}
          shows={this.hasHistory && this.shows}
        />
      )
    }
  }

export const PlaylistRowComposer = PlaylistRow =>
  @inject('playlistStore', 'userStore')
  @observer
  class Enhanced extends React.Component {
    @computed
    get hasPlaylists() {
      const { userStore } = this.props
      return (
        userStore.currentUser &&
        userStore.currentUser.playlists &&
        userStore.currentUser.playlists.length
      )
    }

    @computed
    get playlists() {
      const { userStore } = this.props
      return userStore.currentUser ? userStore.currentUser.playlists : []
    }

    render() {
      return (
        <PlaylistRow
          {...this.props}
          hasPlaylists={this.hasPlaylists}
          title={'Continue listenling'}
          playlists={this.playlists}
        />
      )
    }
  }
