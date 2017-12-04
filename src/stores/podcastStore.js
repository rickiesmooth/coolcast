import client from '../apollo'
import gql from 'graphql-tag'
import { observable, action, computed } from 'mobx'
import PodcastModel from '../models/PodcastModel'
import EpisodeModel from '../models/EpisodeModel'
import { fromPromise } from 'mobx-utils'

const API_URL = 'https://itunes.apple.com'
const GET_FEED_URL =
  'https://us-central1-personal-180010.cloudfunctions.net/getFeed-1'

const inString = (s, q) => s.toLowerCase().includes(q.toLowerCase())

export default class PodcastStore {
  @observable shows = {}
  @observable episodes = {}
  @observable results = []
  @observable query = ''

  @computed
  get searchResults() {
    return Object.keys(this.shows).filter(key =>
      inString(this.shows[key].title, this.query)
    )
  }

  @action
  async searchPodcast(query) {
    this.query = query

    if (!query) {
      this.results = []
      return
    }

    const apiSearchResults = await fetch(
      `${API_URL}/search?term=${encodeURIComponent(
        query
      )}&entity=podcast&limit=15`
    ).then(response => response.json())

    apiSearchResults.results.forEach(item => {
      const key = item.collectionId
      if (!this.shows[key]) {
        this.shows[key] = new PodcastModel(
          this,
          key,
          item.trackName,
          item.feedUrl,
          item.artworkUrl100,
          item.artworkUrl600
        )
      }
    })
    this.results = this.searchResults.map(show => this.shows[show])
  }

  @action
  async getPodcastById(key, graphcoolPodcastId) {
    if (!this.shows[key]) {
      const response = await fetch(
        `${API_URL}/lookup?id=${key}`
      ).then(response => response.json())
      const podcast = response.results[0]
      this.shows[key] = new PodcastModel(
        this,
        podcast.collectionId,
        podcast.trackName,
        podcast.feedUrl,
        podcast.artworkUrl100,
        podcast.artworkUrl600,
        graphcoolPodcastId
      )
    }

    return this.shows[key]
  }

  @action
  getCurrentPodcast = async ({ key }) => {
    //TODO check this
    if (!this.shows[key] || !this.shows[key].graphcoolPodcastId) {
      const result = await client.mutate({
        mutation: GET_PODCAST_ID,
        variables: {
          showId: parseInt(key)
        }
      })
      const data = result.data.getPodcastId
      const podcast = await this.getPodcastById(key, data)
      this.shows[key] = Object.assign(podcast, data)
    }

    return this.shows[key]
  }
  @action
  async getPodcastEpisodes(key, history) {
    const target = this.shows[key]
    const newPodcast = target.newPodcast
    if (target.graphcoolPodcastId) {
      this.shows[key].episodes = newPodcast
        ? await window
            .fetch(
              `${GET_FEED_URL}?url=${target.feedUrl}&id=${target.graphcoolPodcastId}`
            )
            .then(response => response.json())
            .then(json => {
              const data = Object.keys(json).map(key => json[key])
              console.log('✨data', data)
              return this.addEpisodesToState(data, key, history)
            })
        : await client // https://github.com/graphcool/framework/issues/743
            .query({
              query: SHOW_EPISODES,
              variables: {
                id: target.graphcoolPodcastId
              }
            })
            .then(res =>
              this.addEpisodesToState(res.data.Show.episodes, key, history)
            )
    } else {
      console.warn(
        'no graphcoolPodcastId weird, who calls getPodcastEpisodes without'
      )
    }
    return this.shows[key].episodes
  }

  @action
  async addEpisodesToState(target, showId, history) {
    if (!this.shows[showId].episodes) {
      this.shows[showId].episodes = []
    }

    return target.map(i => {
      const episode = this.episodes[i.id]
      if (!episode) {
        this.shows[showId].episodes.push(i.id)
        this.episodes[i.id] = new EpisodeModel(
          this,
          i.id,
          i.title,
          i.src,
          i.description,
          i.plays || (history && history[i.id] && history[i.id].plays)
        )
      }

      return i.id
    })
  }

  @action
  currentUserHistory = async userHistory =>
    await Promise.all(
      Object.keys(userHistory).map(key => {
        if (!this.shows[key]) {
          this.shows[key] = this.getPodcastById(key, userHistory[key].id)
          this.addEpisodesToState(userHistory[key].episodes, key)
        }
        return this.shows[key]
      })
    )
}

const GET_PODCAST_ID = gql`
  mutation GetPodcastIdandCheckIfNew($showId: Int!) {
    getPodcastId(showId: $showId) {
      graphcoolPodcastId
      newPodcast
    }
  }
`

const SHOW_EPISODES = gql`
  query ShowEpisodes($id: ID!) {
    Show(id: $id) {
      episodes {
        id
        src
        description
        title
      }
    }
  }
`
