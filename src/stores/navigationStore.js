import { types, getRoot } from 'mobx-state-tree'

export const NavigationStore = types
  .model({
    page: 'home',
    selectedShowId: types.maybe(types.number),
    episodePlaying: types.maybe(types.string)
  })
  .views(self => ({
    get root() {
      return getRoot(self)
    }
  }))
  .actions(self => ({
    updateSelectedShow(show) {
      console.log('✨showId', show)
      self.selectedShowId = show.id
    },
    setCurrentPlaying(id) {
      self.episodePlaying = id
    }
  }))
