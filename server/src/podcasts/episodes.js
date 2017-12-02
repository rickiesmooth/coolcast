const fromEvent = require('graphcool-lib').fromEvent

// addToLikedPosts(usersUserId: ID!, podcastsPodcastId: ID!)

const createPodcastPlay = `
  mutation CreateUserMutation($userId: ID!, $episodeId: ID!) {
  createPodcastPlay(
    userId: $userId,
    episodeId: $episodeId
  ) {
    id
    progress
  }
}`

const addToUserHistory = (api, episodeId, userId) => {
  return api
    .request(createPodcastPlay, { userId, episodeId })
    .then(podcastMutationResult => podcastMutationResult.createPodcastPlay)
}

export default async event => {
  const graphcool = fromEvent(event)
  const api = graphcool.api('simple/v1')

  return addToUserHistory(api, event.data.episodeId, event.context.auth.nodeId)
    .then(result => {
      return { data: result }
    })
    .catch(error => {
      // Log error, but don't expose to caller
      console.log('✨error', error)
      console.log(`Error: ${JSON.stringify(error)}`)
      return { error: `Error: ${JSON.stringify(error)}` }
    })
}
