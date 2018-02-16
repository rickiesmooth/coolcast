import { types, getParent, flow, getRoot, destroy } from 'mobx-state-tree'
import { Episode } from './podcastStore'
export const Playlist = types.model('Playlist', {
  id: types.identifier(),
  name: types.string,
  episodes: types.maybe(types.array(types.reference(Episode)))
})

export const PlaylistStore = types
  .model('PlaylistStore', {
    creatingPlaylist: false,
    addingToPlaylist: false,
    playlists: types.map(Playlist)
  })
  .views(self => ({
    get root() {
      return getRoot(self)
    }
  }))
  .actions(self => {
    const removePlaylist = id => {
      const playlist = self.playlists.get(id)
      self.root.apolloStore.removePlaylist(id)
      console.log('✨playlist', playlist)
      return destroy(playlist)
    }
    const addToPlaylist = (playlistId, episodeId) => {
      self.root.apolloStore.addToPlaylist(playlistId, episodeId)
      const playlist = self.playlists.get(playlistId)
      console.log('✨playsist', playlist)
      playlist.episodes.push(episodeId)
      return playlist
    }
    const addPlaylist = flow(function*({ id, name, episodes = [] }) {
      console.log('✨episodes', episodes)
      if (!id) {
        const response = yield self.root.apolloStore.addPlaylist({ name })
        const playlistId = response.data.addPlaylist.id
        self.playlists.put({ id: playlistId, name, episodes })
        self.root.userStore.updatePlaylists(playlistId)
      } else {
        console.log('✨add id', id)
        self.playlists.put({ id, name, episodes })
      }
    })

    return {
      addPlaylist,
      addToPlaylist,
      removePlaylist
    }
  })
