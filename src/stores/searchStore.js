import { types, getRoot, flow } from 'mobx-state-tree'
const API_URL = 'https://itunes.apple.com'

export const SearchResult = types.model('SearchResult', {
  id: types.identifier(),
  title: types.string,
  feedUrl: types.string,
  thumb: types.string
})

const inString = (s, q) => s.toLowerCase().includes(q.toLowerCase())

export const SearchStore = types
  .model({
    results: types.map(SearchResult),
    query: types.string
  })
  .views(self => ({
    get root() {
      return getRoot(self)
    },
    get searchResults() {
      return self.results.values().filter(r => inString(r.title, self.query))
    }
  }))
  .actions(self => ({
    putPodcast: ({ id, title, feedUrl, thumb }) => {
      self.results.put({ title, feedUrl, thumb, id: id.toString() })
    },
    searchPodcast: async query => {
      self.query = query

      if (!query) {
        self.results = {}
        return
      }

      const apiSearchResults = await fetch(
        `${API_URL}/search?term=${encodeURIComponent(
          query
        )}&entity=podcast&limit=10`
      ).then(response => response.json())

      apiSearchResults.results.forEach(item => {
        const key = item.collectionId
        if (!self.results.get(key) && item.feedUrl) {
          self.putPodcast({
            id: key.toString(),
            title: item.trackName,
            feedUrl: item.feedUrl,
            thumb: item.artworkUrl60
          })
        }
      })
    }
  }))
