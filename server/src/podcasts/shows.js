const fromEvent = require('graphcool-lib').fromEvent

const podcastQuery = `
query ShowQuery($showId: Int!) {
  Show(showId: $showId){
    id
  }
}`

const createPodcastMutation = `
mutation CreateShowMutation($showId: Int) {
  createShow(
    showId: $showId
  ) {
    id
  }
}`

const getPodcast = (api, showId) => {
  return api.request(podcastQuery, { showId }).then(podcastQueryResult => {
    if (podcastQueryResult.error) {
      return Promise.reject(podcastQueryResult.error)
    } else {
      return podcastQueryResult.Show
    }
  })
}

const createPodcast = (api, showId) => {
  return api
    .request(createPodcastMutation, { showId })
    .then(podcastQueryResult => {
      if (podcastQueryResult.error) {
        return Promise.reject(podcastQueryResult.error)
      } else {
        return podcastQueryResult.createShow
      }
    })
}

export default async event => {
  const graphcool = fromEvent(event)
  const api = graphcool.api('simple/v1')
  const showId = event.data.showId
  let newPodcast = false
  return getPodcast(api, showId)
    .then(graphcoolPodcast => {
      if (!graphcoolPodcast) {
        newPodcast = true
        return createPodcast(api, showId)
      } else {
        return graphcoolPodcast
      }
    })
    .then(result => {
      return {
        data: {
          newPodcast,
          graphcoolPodcastId: result.id
        }
      }
    })
    .catch(error => {
      // Log error, but don't expose to caller
      console.log('✨error', error)
      console.log(`Error: ${JSON.stringify(error)}`)
      return { error: `Error: ${JSON.stringify(error)}` }
    })
}
