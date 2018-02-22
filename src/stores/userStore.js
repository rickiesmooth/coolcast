import { when, reaction } from 'mobx'
import {
  types,
  getParent,
  getSnapshot,
  applySnapshot,
  getRoot,
  flow
} from 'mobx-state-tree'
import { Show, Episode } from './podcastStore'
import { AsyncStorage } from 'react-native'

export const User = types.model('User', {
  id: types.identifier(),
  email: types.maybe(types.string),
  name: types.string,
  fbid: types.string,
  history: types.maybe(types.array(types.reference(Show)))
})

export const UserStore = types
  .model('UserStore', {
    currentUser: types.maybe(types.reference(User)),
    users: types.map(User)
  })
  .views(self => ({
    get root() {
      return getRoot(self)
    },
    get hasHistory() {
      return (
        self.currentUser &&
        self.currentUser.history &&
        self.currentUser.history.length > 0
      )
    },
    userHistoryShow(id) {
      // const { match, navigation, userStore } = this.props
      return (
        self.currentUser &&
        self.currentUser.history &&
        self.currentUser.history.length &&
        self.currentUser.history.find(show => show.id === id)
      )
    },
    get groupedUserHistory() {
      const userHistory = self.root.apolloStore.userHistory
      return self.currentUser.history
    }
  }))
  .actions(self => ({
    setCurrentUser: flow(function*({ me }) {
      const { id, email, fbid, name, history, playlists } = me
      const podcastStore = self.root.podcastStore
      self.users.put({
        id,
        email,
        fbid,
        name,
        history: history.shows.map(({ show, plays }) => {
          console.log('✨_plays', plays, me)
          const addedShow = self.root.podcastStore.addShow({
            id: show.showId,
            title: decodeURI(show.title),
            thumbLarge: show.thumbLarge,
            graphcoolShowId: show.id,
            history: plays.map(play => {
              self.root.podcastStore.addEpisode({
                id: play.episode.id,
                title: play.episode.title,
                sessionId: play.id,
                progress: play.progress,
                showId: show.showId
              })
              return play.episode.id
            })
          })
          return addedShow.id
        })
      })
      self.currentUser = id
      playlists.map(({ id, name, episodes }) => {
        self.root.playlistStore.addPlaylist({
          id,
          name,
          author: me.id,
          episodes: episodes.map(ep => {
            self.root.podcastStore.addEpisode({
              id: ep.id,
              title: ep.title,
              showId: ep.show[0].showId
            })
            return ep.id
          })
        })
        return id
      })
    }),
    async readFromLocalStorage() {
      const token = await AsyncStorage.getItem('graphcoolToken')
      if (token) {
        const response = await self.root.apolloStore.userFromToken
        self.setCurrentUser(response.data)
      }
    },
    addUser(user) {
      const result = self.users.get(user.id)
      if (!result) {
        self.users.put(user)
      } else {
        for (var key in user) {
          result[key] = result[key] || user[key]
        }
      }
    },
    async getUser(userId) {
      const response = await self.root.apolloStore.getUser(userId)
      self.addUser(response.data.user)
    },
    async login(token) {
      const response = await self.root.apolloStore.userFromFBToken(token)
      AsyncStorage.setItem('graphcoolToken', response.data.authenticate.token)

      const userHistory = await self.root.apolloStore.userFromToken
      self.setCurrentUser(userHistory.data)
      return response
    },
    updateHistory({ showId, id }) {
      const show = self.root.podcastStore.shows.get(showId)
      if (!self.currentUser.history.find(ep => ep.id === showId)) {
        self.currentUser.history.push(showId)
        show.updateHistory(id)
      }
      if (show.history && !show.history.find(ep => ep.id === id)) {
        show.updateHistory(id)
      }
    },
    updatePlaylists(id) {
      self.currentUser.playlists.push(id)
    },
    logout() {
      AsyncStorage.removeItem('graphcoolToken')
      self.currentUser = null
    }
  }))
