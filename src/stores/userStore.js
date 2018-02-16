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
  history: types.maybe(types.array(types.reference(Show))),
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
      console.log('✨checking')
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
      return self.currentUser.history
    }
  }))
  .actions(self => ({
    setCurrentUser: flow(function*({ me }) {
      const { id, email, fbid, name, history, playlists } = me
      const podcastStore = self.root.podcastStore
      const userInfo = {
        id,
        email,
        fbid,
        name,
        history: history.shows.map(({ show, plays }) => {
          const addedShow = self.root.podcastStore.addShow({
            id: show.showId,
            title: decodeURI(show.title),
            thumbLarge: show.thumbLarge,
            graphcoolShowId: show.id,
            history: plays.map(play => {
              console.log('✨play.id', play.id)
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
        }),
        playlists: playlists.map(({ id, name, episodes }) => {
          self.root.playlistStore.addPlaylist({
            id,
            name,
            episodes: episodes.map(ep => ep.id)
          })
          return id
        })
      }

      self.currentUser = User.create(userInfo)
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
