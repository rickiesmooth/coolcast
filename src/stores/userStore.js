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
import { Playlist } from './playlistStore'
import { AsyncStorage } from 'react-native'

export const User = types.model('User', {
  id: types.identifier(),
  email: types.string,
  fbid: types.string,
  history: types.maybe(types.array(types.reference(Episode))),
  playlists: types.maybe(types.array(types.reference(Playlist)))
})

export const UserStore = types
  .model('UserStore', {
    currentUser: types.maybe(User)
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
    get hasPlaylists() {
      return (
        self.currentUser &&
        self.currentUser.playlists &&
        self.currentUser.playlists.length > 0
      )
    },
    get userHistory() {
      const apolloStore = self.root.apolloStore
      return apolloStore.userHistory
    },
    get groupedUserHistory() {
      return self.currentUser.history.reduce((r, episode) => {
        r[episode.showId] = r[episode.showId] || {}
        r[episode.showId].episodes = r[episode.showId].episodes || []
        r[episode.showId].episodes.push(episode.id)
        return r
      }, {})
    }
  }))
  .actions(self => ({
    setCurrentUser: flow(function*({ me }) {
      const { id, email, fbid, name, history, likes, playlists } = me
      const userInfo = {
        id,
        email,
        fbid,
        name,
        history: history.map(({ id, episode, progress }) => {
          const podcastStore = self.root.podcastStore
          podcastStore.addEpisode({
            id: episode.id,
            sessionId: id,
            progress,
            showId: episode.show[0].showId
          })
          return episode.id
        }),
        likes: likes.map(({ id, episode }) => {
          const podcastStore = self.root.podcastStore
          podcastStore.addEpisode({
            id: episode.id,
            likeId: id,
            showId: episode.show[0].showId
          })
          return episode.id
        }),
        playlists: playlists.map(({ id, name, episodes }) => {
          const playlistStore = self.root.playlistStore
          playlistStore.addPlaylist({
            id,
            name,
            episodes: episodes.map(ep => ep.id)
          })
          return id
        })
      }

      self.currentUser = User.create(userInfo)

      if (history.length > 0 || likes.length > 0) {
        const userHistory = yield self.root.apolloStore.userHistory
        const { userHistoryEpisodes, userHistoryShows } = userHistory.data

        userHistoryShows.forEach(({ showId, title, thumbLarge, id }) => {
          self.root.podcastStore.addShow({
            id: showId,
            title: decodeURI(title),
            thumbLarge,
            graphcoolShowId: id
          })
        })
        userHistoryEpisodes.forEach(episode => {
          const podcastStore = self.root.podcastStore
          const show = episode.show[0]
          const storeEpisode = podcastStore.episodes.get(episode.id)
          return podcastStore.addEpisode({
            id: episode.id,
            title: episode.title,
            src: episode.src,
            showId: show.showId,
            description: episode.description
          })
        })
      }
    }),
    async readFromLocalStorage() {
      const token = await AsyncStorage.getItem('graphcoolToken')
      if (token) {
        const graphcoolResponse = await self.root.apolloStore.userFromToken
        self.setCurrentUser(graphcoolResponse.data)
      }
    },
    async login(token) {
      const graphcoolResponse = await self.root.apolloStore.userFromFBToken(
        token
      )
      AsyncStorage.setItem(
        'graphcoolToken',
        graphcoolResponse.data.authenticate.token
      )

      const userHistory = await self.root.apolloStore.userFromToken
      self.setCurrentUser(userHistory.data)
      return graphcoolResponse
    },
    updateHistory(id) {
      self.currentUser.history.push(id)
    },
    updatePlaylists(id) {
      self.currentUser.playlists.push(id)
    },
    logout() {
      AsyncStorage.removeItem('graphcoolToken')
      self.currentUser = null
    }
  }))
