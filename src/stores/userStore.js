import { when, reaction } from 'mobx'
import {
  types,
  getParent,
  getSnapshot,
  applySnapshot,
  getRoot,
  flow
} from 'mobx-state-tree'
import { AsyncStorage } from 'react-native'

export const User = types.model('User', {
  id: types.identifier(),
  email: types.optional(types.string, ''),
  name: types.optional(types.string, ''),
  fbid: types.optional(types.string, '')
})

export const UserStore = types
  .model('UserStore', {
    currentUser: types.maybe(User)
  })
  .views(self => ({
    get root() {
      return getRoot(self)
    }
  }))
  .actions(self => ({
    setCurrentUser: flow(function*({ me }) {
      const { id, email, fbid, name } = me
      self.currentUser = { id, email, fbid, name }
    }),
    async readFromLocalStorage() {
      const token = await AsyncStorage.getItem('graphcoolToken')
      if (token) {
        const response = await self.root.apolloStore.userFromToken
        self.setCurrentUser(response.data)
      }
    },
    logout() {
      AsyncStorage.removeItem('graphcoolToken')
      self.currentUser = null
    }
  }))
