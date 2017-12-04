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
    this.plays = plays || this.plays
  }
}
