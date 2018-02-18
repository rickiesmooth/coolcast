import { types, getParent, flow, getRoot, destroy } from 'mobx-state-tree'
import { Episode } from './podcastStore'
import { User } from './userStore'

console.log('✨User', User)

export const Playlist = types.model('Playlist', {
  id: types.identifier(),
  name: types.string,
  author: types.reference(User),
  episodes: types.maybe(types.array(types.reference(Episode)))
})

export const PlaylistStore = types
  .model('PlaylistStore', {
    playlists: types.map(Playlist)
  })
  .views(self => ({
    get root() {
      return getRoot(self)
    },
    get hasPlaylists() {
      return self.playlists && self.playlists.values().length > 0
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
    const addPlaylist = flow(function*({ id, author, name, episodes = [] }) {
      console.log('✨episodes', author)
      if (!id) {
        const response = yield self.root.apolloStore.addPlaylist({ name })
        const playlistId = response.data.addPlaylist.id
        self.playlists.put({ id: playlistId, author, name, episodes })
        self.root.userStore.updatePlaylists(playlistId)
      } else {
        console.log('✨add id', id)
        self.playlists.put({ id, name, episodes, author })
      }
    })

    return {
      addPlaylist,
      addToPlaylist,
      removePlaylist
    }
  })
