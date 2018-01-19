import { types, getRoot } from 'mobx-state-tree'

export const ViewStore = types
  .model({
    page: 'home',
    selectedShowId: '',
    episodePlaying: types.maybe(types.string)
  })
  .views(self => ({
    get root() {
      return getRoot(self)
    },
    get isLoading() {
      return self.shop.isLoading
    },
    get currentUrl() {
      switch (self.page) {
        case 'books':
          return '/'
        case 'book':
          return '/book/' + self.selectedBookId
        case 'cart':
          return '/cart'
        default:
          return '/404'
      }
    },
    get selectedShow() {
      return self.isLoading || !self.selectedShowId
        ? null
        : self.root.podcastStore.shows.get(self.selectedShowId)
    }
  }))
  .actions(self => ({
    openHomePage() {
      self.page = 'home'
      self.selectedBookId = ''
    },
    openShowPage(show) {
      self.page = 'podcast'
      self.selectedShowId = show.id
    },
    openShowPageById(id) {
      self.page = 'podcast'
      self.selectedShowId = id
    },
    setCurrentPlaying(id) {
      self.episodePlaying = id
    }
  }))
