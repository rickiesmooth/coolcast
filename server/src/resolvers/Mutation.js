const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')
const GET_FEED_URL =
  'https://us-central1-personal-180010.cloudfunctions.net/getFeed'

const API_URL = 'https://itunes.apple.com'

function getPrismaUser(ctx, fbid) {
  return ctx.db.query.user({ where: { fbid } })
}

async function createPrismaUser(ctx, facebookUser) {
  console.log('✨facebookUser', facebookUser)
  const user = await ctx.db.mutation.createUser({
    data: {
      fbid: facebookUser.id,
      email: facebookUser.email,
      name: facebookUser.name
    }
  })
  return user
}

async function getFacebookUser(facebookToken) {
  console.log('✨facebookToken', facebookToken)
  const endpoint = `https://graph.facebook.com/v2.12/me?fields=id%2Cname%2Cemail&access_token=${facebookToken}`
  const data = await global.fetch(endpoint).then(response => response.json())

  if (data.error) {
    throw new Error(JSON.stringify(data.error))
  }

  return data
}

async function authenticate(parent, { facebookToken }, ctx, info) {
  const facebookUser = await getFacebookUser(facebookToken)
  let user = await getPrismaUser(ctx, facebookUser.id)

  if (!user) {
    user = await createPrismaUser(ctx, facebookUser)
  }

  return {
    token: jwt.sign({ userId: user.id }, APP_SECRET),
    user
  }
}

async function getPodcast(parent, { showId }, ctx, info) {
  const show = await ctx.db.query.show({ where: { showId } }, info)
  if (!show) {
    const { results } = await global
      .fetch(`${API_URL}/lookup?id=${showId}`)
      .then(res => res.json())
    const episodes = await global
      .fetch(`${GET_FEED_URL}?url=${results[0].feedUrl}`)
      .then(res => res.json())
      .catch(error => console.error('Error:', error))
    console.log('✨episodes', episodes)
    return ctx.db.mutation.createShow(
      {
        data: {
          title: encodeURI(results[0].collectionName),
          showId,
          thumbLarge: results[0].artworkUrl600,
          episodes: {
            create: episodes
          }
        }
      },
      info
    )
  } else {
    return show
  }
}

function addPlay(parent, { episodeId }, ctx, info) {
  const userId = getUserId(ctx)
  return ctx.db.mutation.createPodcastPlay(
    {
      data: {
        user: { connect: { id: userId } },
        episode: { connect: { id: episodeId } }
      }
    },
    info
  )
}

function addPlaylist(parent, { name }, ctx, info) {
  const userId = getUserId(ctx)
  return ctx.db.mutation.createPlaylist(
    {
      data: {
        name,
        user: { connect: { id: userId } }
      }
    },
    info
  )
}

async function removePlaylist(parent, { id }, ctx, info) {
  const userId = getUserId(ctx)
  console.log('✨userId', userId) // check if owns playlist
  return ctx.db.mutation.deletePlaylist({ where: { id } }, '{ id }')
}

function updatePlay(parent, { sessionId, progress }, ctx, info) {
  // const userId = getUserId(ctx)
  return ctx.db.mutation.updatePodcastPlay(
    {
      where: { id: sessionId },
      data: { progress }
    },
    info
  )
}

function updatePlaylist(parent, { playlistId, episodeId }, ctx, info) {
  // const userId = getUserId(ctx)
  return ctx.db.mutation.updatePlaylist(
    {
      where: { id: playlistId },
      data: {
        episodes: { connect: { id: episodeId } }
      }
    },
    info
  )
}

async function updateLike(parent, { episodeId, likeId }, ctx, info) {
  const userId = getUserId(ctx)
  console.log('✨userId, episodeId', likeId)
  if (likeId) {
    return ctx.db.mutation.deletePodcastLike(
      { where: { id: likeId } },
      '{ id }'
    )
  } else {
    return ctx.db.mutation.createPodcastLike(
      {
        data: {
          user: { connect: { id: userId } },
          episode: { connect: { id: episodeId } }
        }
      },
      info
    )
  }
}

module.exports = {
  authenticate,
  getPodcast,
  updateLike,
  addPlay,
  addPlaylist,
  updatePlaylist,
  removePlaylist,
  updatePlay
}
