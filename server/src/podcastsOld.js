const fromEvent = require('graphcool-lib').fromEvent
const crypto = require('crypto')
// addToLikedPosts(usersUserId: ID!, podcastsPodcastId: ID!)

const createRelationMutation = `
mutation CreateUserMutation($likedPostsPodcastId: ID!, $likedByUserId: ID!) {
  addToLikedPosts(
    likedPostsPodcastId: $likedPostsPodcastId,
    likedByUserId: $likedByUserId
  ) {
    likedPostsPodcast {
      id
    }
  }
}`

const createPodcastMutation = `
mutation CreatePodcastMutation($podcastId: String) {
  createPodcast(
    podcastId: $podcastId
  ) {
    id
  }
}`

const podcastQuery = `
query PodcastQuery($podcastId: String!) {
  Podcast(podcastId: $podcastId){
    id
  }
}`

const getPodcast = (api, podcastId) => {
  return api.request(podcastQuery, { podcastId }).then(podcastQueryResult => {
    if (podcastQueryResult.error) {
      return Promise.reject(podcastQueryResult.error)
    } else {
      return podcastQueryResult.Podcast
    }
  })
}

const createGraphcoolPodcast = (api, podcastId) => {
  return api
    .request(createPodcastMutation, { podcastId })
    .then(podcastMutationResult => podcastMutationResult.createPodcast.id)
}

const createGraphcoolPodcastRelation = (
  api,
  likedPostsPodcastId,
  likedByUserId
) => {
  return api
    .request(createRelationMutation, { likedPostsPodcastId, likedByUserId })
    .then(podcastMutationResult => podcastMutationResult)
}

export default async event => {
  const graphcool = fromEvent(event)
  const api = graphcool.api('simple/v1')
  const podcastId = crypto
    .createHash('md5')
    .update(event.data.podcastId)
    .digest('hex')
  let newPodcast = false
  return getPodcast(api, podcastId)
    .then(graphcoolPodcast => {
      if (!graphcoolPodcast) {
        newPodcast = true
        return createGraphcoolPodcast(api, podcastId)
      } else {
        return graphcoolPodcast.id
      }
    })
    .then(podcastsPodcastId => {
      const usersUserId = event.context.auth.nodeId
      return createGraphcoolPodcastRelation(api, podcastsPodcastId, usersUserId)
    })
    .then(result => {
      return {
        data: {
          shouldUpdatePodcast: newPodcast
            ? result.addToLikedPosts.likedPostsPodcast.id
            : ''
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
