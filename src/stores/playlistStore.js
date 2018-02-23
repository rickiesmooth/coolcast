import { types, getParent, flow, getRoot, destroy } from 'mobx-state-tree'
import { Episode } from './podcastStore'
import { User } from './userStore'

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
      self.root.userStore.updatePlaylists(id, true)
      return destroy(playlist)
    }
    const getPlaylist = flow(function*({ playlistId }) {
      const response = yield self.root.apolloStore.getPlaylist(playlistId)
      const { id, name, user, episodes } = response.data.playlists[0]
      if (!self.root.userStore.users.get(user.id)) {
        self.root.userStore.addUser(user)
      }
      addPlaylist({
        id,
        name,
        author: user.id,
        episodes: episodes.map(ep => {
          self.root.podcastStore.addEpisode(ep)
          return ep.id
        })
      })
    })
    const addToPlaylist = (playlistId, episodeId) => {
      const playlist = self.playlists.get(playlistId)
      self.root.apolloStore.addToPlaylist(playlistId, episodeId)
      playlist.episodes.push(episodeId)
      return playlist
    }
    const addPlaylist = flow(function*({ id, author, name, episodes = [] }) {
      if (!id) {
        const response = yield self.root.apolloStore.addPlaylist({ name })
        const playlistId = response.data.addPlaylist.id
        self.playlists.put({ id: playlistId, author, name, episodes })
        self.root.userStore.updatePlaylists(playlistId)
      } else {
        self.playlists.put({ id, name, episodes, author })
      }
    })

    return {
      addPlaylist,
      getPlaylist,
      addToPlaylist,
      removePlaylist
    }
  })
