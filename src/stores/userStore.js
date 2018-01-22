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
  email: types.string,
  facebookUserId: types.string,
  history: types.maybe(types.array(types.reference(Episode)))
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
    authenticate: flow(function* setCurrentUser(user) {
      console.log('✨yeah', user)
      return self.root.apolloStore.userFromFBToken(user)
    }),
    setCurrentUser: flow(function* setCurrentUser(user) {
      const shows = {}
      self.currentUser = User.create(user)
      // const response
      //  = yield self.userHistory
      // const { history, likedEpisodes } = response.data.user
      // console.log('✨likedEpisodes', likedEpisodes)
      //
      // self.currentUser = User.create(
      //   Object.assign(user, {
      //     history: yield Promise.all(
      //       history.map(({ id, episode, progress }) => {
      //         const { title, src, show, description, duration } = episode
      //         shows[show[0].showId] = show[0].id
      //         return self.addEntryToPodcastStore({
      //           title,
      //           src,
      //           description,
      //           progress,
      //           id: episode.id,
      //           sessionId: id,
      //           duration: parseInt(duration) || 0,
      //           showId: show[0].showId
      //         })
      //       })
      //     ),
      //     likedEpisodes: likedEpisodes.map(e => {
      //       const episode = self.root.podcastStore.episodes.get(e.id)
      //       if (episode) {
      //         episode.toggleLiked(true, true)
      //       } else {
      //         return self.addEntryToPodcastStore({})
      //       }
      //     })
      //   })
      // )
      // console.log('✨self.', self.currentUser.history)
      // // @TODO hacky?
      // Object.keys(shows).forEach(show => {
      //   self.root.podcastStore.addShow(show, shows[show])
      // })
    }),
    addEntryToPodcastStore: episode => {
      // const { id, title, src, show, description, duration } = entry.episode
      self.root.podcastStore.addEpisode(episode)
      return episode.id
    },
    async readFromLocalStorage() {
      const token = await AsyncStorage.getItem('graphcoolToken')
      if (token) {
        const graphcoolResponse = await self.root.apolloStore.userFromToken
        const { email, facebookUserId, id } = graphcoolResponse.data.me
        console.log('✨', email, facebookUserId, id)
        self.setCurrentUser({ email, facebookUserId, id })
      }
    },
    logout() {
      AsyncStorage.removeItem('graphcoolToken')
      self.currentUser = null
    }
  }))
