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
    currentUser: types.maybe(types.reference(User)),
    users: types.map(User)
  })
  .views(self => ({
    get root() {
      return getRoot(self)
    }
  }))
  .actions(self => ({
    setCurrentUser: flow(function*({ me }) {
      const { id, email, fbid, name } = me
      self.users.put({
        id,
        email,
        fbid,
        name
      })
      self.currentUser = id
    }),
    async readFromLocalStorage() {
      const token = await AsyncStorage.getItem('graphcoolToken')
      if (token) {
        const response = await self.root.apolloStore.userFromToken
        self.setCurrentUser(response.data)
      }
    },
    async login(token) {
      const response = await self.root.apolloStore.userFromFBToken(token)
      AsyncStorage.setItem('graphcoolToken', response.data.authenticate.token)

      const userHistory = await self.root.apolloStore.userFromToken
      self.setCurrentUser(userHistory.data)
      return response
    },
    logout() {
      AsyncStorage.removeItem('graphcoolToken')
      self.currentUser = null
    }
  }))
