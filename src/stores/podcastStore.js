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
    showId: types.number,
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
  episodes: types.array(types.reference(Episode)),
  feedUrl: types.maybe(types.string),
  newPodcast: types.boolean
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
    },
    get sortedAvailableBooks() {
      return sortBooks(self.shows.values())
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
    const getShow = flow(function* addShow(showId, graphcoolShowId) {
      if (!self.shows.get(showId)) {
        // new Show
        const [itunes, graphcool] = yield Promise.all([
          fetch(`${API_URL}/lookup?id=${showId}`).then(res => res.json()),
          !graphcoolShowId && self.root.apolloStore.getGraphCoolShow(showId)
        ])
        const { id, collectionName, artworkUrl600, feedUrl } = itunes.results[0]
        const graphcoolRes = graphcool.data && graphcool.data.getPodcastId

        self.shows.put({
          id: showId,
          title: collectionName,
          feedUrl,
          episodes: [],
          thumbLarge: artworkUrl600,
          newPodcast: graphcoolRes ? graphcoolRes.newPodcast : false,
          graphcoolShowId: graphcoolShowId || graphcoolRes.graphcoolPodcastId
        })
      }
      return showId
    })

    const getPodcastEpisodes = flow(function* getPodcastEpisodes(key) {
      let show = self.shows.get(key)
      if (!show) {
        yield addShow(key)
        show = self.shows.get(key)
      }
      const episodes = show.newPodcast
        ? yield window
            .fetch(
              `${GET_FEED_URL}?url=${show.feedUrl}&id=${show.graphcoolShowId}`
            )
            .then(response => response.json())
            .then(json => Object.keys(json).map(key => json[key]))
        : yield self.root.apolloStore
            .getEpisodesFromGraphcool(show.graphcoolShowId)
            .then(res => res.data.Show.episodes)

      show.episodes = episodes.map(ep => {
        const { id, title, src, description, duration } = ep
        return addEpisode({
          showId: parseInt(key),
          sessionId: '',
          duration: parseInt(duration),
          progress: 0,
          id,
          title,
          src,
          description
        })
      })
      return show.episodes
    })

    return {
      addEpisode,
      getShow,
      getPodcastEpisodes
    }
  })

function sortBooks(books) {
  return books
    .filter(b => b.isAvailable)
    .sort((a, b) => (a.name > b.name ? 1 : a.name === b.name ? 0 : -1))
}
