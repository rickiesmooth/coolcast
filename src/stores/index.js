import { types, getEnv } from 'mobx-state-tree'
import { PodcastStore } from './podcastStore'
import { PlayerStore } from './playerStore'
import { PlaylistStore } from './playlistStore'
import { UserStore } from './userStore'
import { NavigationStore } from './navigationStore'
import { ApolloStore } from './apolloStore'
import { SearchStore } from './searchStore'

const RootStore = types
  .model('RootStore', {
    podcastStore: types.optional(PodcastStore, {
      shows: {},
      episodes: {}
    }),
    userStore: types.optional(UserStore, {
      currentUser: null,
      users: {}
    }),
    playlistStore: types.optional(PlaylistStore, {
      playlists: {}
    }),
    navigationStore: types.optional(NavigationStore, {
      page: ''
    }),
    searchStore: types.optional(SearchStore, {
      results: {},
      query: ''
    }),
    apolloStore: types.optional(ApolloStore, {
      client: ''
    }),
    playerStore: types.optional(PlayerStore, {
      state: {
        playbackInstancePosition: 0,
        playbackInstanceDuration: 0,
        shouldPlay: true,
        isPlaying: false,
        isBuffering: false,
        isLoading: true,
        thumb: '',
        volume: 1.0,
        rate: 1.0
      }
    })
  })
  .views(self => ({
    get fetch() {
      return getEnv(self).fetch
    },
    get currentShow() {
      return self.podcastStore.shows.get(self.navigationStore.selectedShowId)
    }
  }))
  .actions(self => ({
    afterCreate() {
      if (typeof window !== 'undefined') {
        window.store = self
        self.userStore.readFromLocalStorage()
      }
    }
  }))

export default RootStore
