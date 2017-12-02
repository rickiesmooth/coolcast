import { observable } from 'mobx'

export default class PodcastModel {
  constructor(
    store,
    key,
    title,
    feedUrl,
    thumb,
    thumbLarge,
    graphcoolPodcastId,
    episodes = []
  ) {
    this.store = store
    this.key = key
    this.title = title
    this.feedUrl = feedUrl
    this.thumb = thumb
    this.thumbLarge = thumbLarge
    this.graphcoolPodcastId = graphcoolPodcastId
    this.episodes = episodes
  }

  toJS() {
    return {
      key: this.key,
      title: this.title,
      thumb: this.thumb,
      thumbLarge: this.thumbLarge,
      graphcoolPodcastId: this.graphcoolPodcastId,
      episodes: this.episodes
    }
  }

  static fromJS(store, object) {
    return new PodcastModel(
      store,
      object.key,
      object.title,
      object.feedUrl,
      object.thumb,
      object.thumbLarge,
      object.graphcoolPodcastId,
      object.episodes
    )
  }
}
