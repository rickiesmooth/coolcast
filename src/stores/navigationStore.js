import { types, getRoot } from 'mobx-state-tree'

export const NavigationStore = types
  .model({
    page: 'home',
    selectedShowId: '',
    episodePlaying: types.maybe(types.string)
  })
  .views(self => ({
    get root() {
      return getRoot(self)
    }
  }))
  .actions(self => ({
    setCurrentPlaying(id) {
      self.episodePlaying = id
    }
  }))
