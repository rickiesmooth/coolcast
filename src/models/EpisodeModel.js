import { observable } from 'mobx'

export default class EpisodeModel {
  @observable
  plays = {
    progress: null
  }
  constructor(store, id, title, src, description, plays) {
    this.store = store
    this.id = id
    this.title = title
    this.src = src
    this.description = description
    this.plays = plays
  }

  toJS() {
    return {
      store: this.store,
      id: this.id,
      title: this.title,
      src: this.src,
      description: this.description,
      plays: this.plays
    }
  }

  static fromJS(store, object) {
    return new PodcastModel(
      store,
      object.store,
      object.id,
      object.title,
      object.src,
      object.description,
      object.plays
    )
  }
}
