import { types, getParent, flow, getRoot } from 'mobx-state-tree'

const API_URL = 'https://itunes.apple.com'
const GET_FEED_URL =
  'https://us-central1-personal-180010.cloudfunctions.net/getFeed-1'

export const Episode = types
  .model('Episode', {
    id: types.identifier(),
    title: types.string,
    src: types.string,
    progress: types.maybe(types.number),
    showId: types.string,
    duration: types.number,
    sessionId: types.string,
    liked: false
  })
  .actions(self => ({
    getSessionId: flow(function* getSessionId() {
      const root = getRoot(self)
      const response = yield root.apolloStore.createPodcastPlay(self.id)
      self.sessionId = response.data.AddPlay.id
      console.log('✨calling getSessionId', self.sessionId)
    }),
    toggleLiked(liked) {
      self.liked = liked
    },
    setProgress(progress) {
      console.log('✨progress', progress)
      self.progress = progress
    }
  }))

export const Show = types.model('Show', {
  id: types.identifier(),
  title: types.string,
  thumbLarge: types.string,
  graphcoolShowId: types.string,
  episodes: types.array(types.reference(Episode))
})

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
      } else if (result && !result.sessionId && episode.sessionId) {
        result.progress = episode.progress
        result.sessionId = episode.sessionId
      }
      return episode.id
    }
    const getShow = flow(function* addShow(showId) {
      if (!self.shows.get(showId)) {
        const response = yield self.root.apolloStore.getGraphCoolShow(showId)
        const { episodes, id, title, thumbLarge } = response.data.getPodcast
        self.shows.put({
          id: showId,
          title: decodeURI(title),
          episodes: episodes.map(ep => {
            addEpisode({
              showId,
              sessionId: '',
              duration: parseInt(ep.duration),
              progress: 0,
              id: ep.id,
              title: decodeURI(ep.title),
              src: ep.src,
              description: decodeURI(ep.description)
            })
            return ep.id
          }),
          thumbLarge,
          graphcoolShowId: id
        })
      }
      return self.shows.get(showId)
    })

    const getPodcastEpisodes = flow(function* getPodcastEpisodes(key) {
      let show = self.shows.get(key)
      if (!show) {
        yield getShow(key)
        show = self.shows.get(key)
      }
      // const episodes = yield self.root.apolloStore
      //   .getEpisodesFromGraphcool(show.graphcoolShowId)
      //   .then(res => res.data.Show.episodes)
      console.log('✨show', show)
      // show.episodes = episodes.map(ep => {
      //   const { id, title, src, description, duration } = ep
      //   return addEpisode({
      //     showId: parseInt(key),
      //     sessionId: '',
      //     duration: parseInt(duration),
      //     progress: 0,
      //     id,
      //     title,
      //     src,
      //     description
      //   })
      // })

      return show.episodes
    })

    return {
      addEpisode,
      getShow,
      getPodcastEpisodes
    }
  })
