import { types, getEnv } from 'mobx-state-tree'
import { PlayerStore } from './playerStore'
import { UserStore } from './userStore'
import { ApolloStore } from './apolloStore'
import { SearchStore } from './searchStore'

const RootStore = types
  .model('RootStore', {
    userStore: types.optional(UserStore, {
      currentUser: null,
      users: {}
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
  .actions(self => ({
    afterCreate() {
      if (typeof window !== 'undefined') {
        window.store = self
        self.userStore.readFromLocalStorage()
      }
    }
  }))

export default RootStore
