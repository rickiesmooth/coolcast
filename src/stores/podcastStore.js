import { types, getParent, flow, getRoot } from 'mobx-state-tree'
const API_URL = 'https://itunes.apple.com'

export const Episode = types
  .model('Episode', {
    id: types.identifier(),
    title: types.maybe(types.string),
    src: types.maybe(types.string),
    progress: types.maybe(types.number),
    showId: types.maybe(types.string),
    duration: types.maybe(types.number),
    sessionId: types.maybe(types.string)
  })
  .views(self => ({
    get root() {
      return getRoot(self)
    }
  }))
  .actions(self => ({
    getSessionId: flow(function* getSessionId() {
      const { userStore, apolloStore } = self.root
      const show = self.root.podcastStore.shows.get(self.showId)
      console.log('✨self.sessionId', self.sessionId)
      const response = yield apolloStore.createPodcastPlay({
        episodeId: self.id,
        showId: show.graphcoolShowId,
        sessionId: self.sessionId
      })
      console.log('✨response', response)
      const { id, episode } = response.data.addPlay
      self.sessionId = id
      self.src = episode.src
      userStore.updateHistory(self)
    }),
    setProgress(progress) {
      self.progress = progress
    }
  }))

export const Show = types
  .model('Show', {
    id: types.identifier(),
    title: types.maybe(types.string),
    thumbLarge: types.maybe(types.string),
    graphcoolShowId: types.maybe(types.string),
    episodes: types.maybe(types.array(types.reference(Episode))),
    history: types.maybe(types.array(types.reference(Episode)))
  })
  .actions(self => ({
    updateHistory(episode) {
      !self.history ? (self.history = [episode]) : self.history.push(episode)
    }
  }))
const getting = []
export const PodcastStore = types
  .model('PodcastStore', {
    isLoading: true,
    shows: types.map(Show),
    episodes: types.map(Episode)
  })
  .views(self => ({
    get root() {
      return getRoot(self)
    }
  }))
  .actions(self => {
    const addEpisode = episode => {
      const result = self.episodes.get(episode.id)
      if (!result) {
        self.episodes.put(episode)
      } else {
        for (var key in episode) {
          result[key] = result[key] || episode[key]
        }
      }
      return self.episodes.get(episode.id)
    }
    const addShow = show => {
      const result = self.shows.get(show.id)
      if (!result) {
        self.shows.put(show)
      } else {
        for (var key in show) {
          result[key] = result[key] || show[key]
        }
      }
      return self.shows.get(show.id)
    }
    const getShow = flow(function*(showId) {
      const result = self.shows.get(showId)
      if (!result && !getting.find(id => id === showId)) {
        getting.push(showId)
        console.log(`✨no result ${showId}`)
        const response = yield self.root.apolloStore.getGraphCoolShow(showId)
        console.log('✨response', response)
        const { episodes, id, title, thumbLarge } = response.data.getPodcast
        self.shows.put({
          id: showId,
          title: decodeURI(title),
          thumbLarge,
          graphcoolShowId: id,
          episodes: episodes.map(ep => {
            addEpisode({
              showId,
              id: ep.id,
              title: decodeURI(ep.title),
              description: decodeURI(ep.description)
            })
            return ep.id
          })
        })
      }
      return self.shows.get(showId)
    })
    const getEpisodes = flow(function* getEpisodes(show) {
      const episodes = yield self.root.apolloStore
        .getEpisodes(show.id)
        .then(res => res.data.shows[0].episodes)
      show.episodes = episodes.map(ep => {
        const { id, title, src, description } = ep
        const episode = addEpisode({
          showId: show.id,
          id,
          title,
          description
        })
        return episode.id
      })
      console.log('✨show.episodes', show.episodes)
      return show.episodes
    })

    return {
      addEpisode,
      addShow,
      getShow,
      getEpisodes
    }
  })

//cjdn61i3n3qgi01581r833mbz
