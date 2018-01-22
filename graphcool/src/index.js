const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')
const jwt = require('jsonwebtoken')
const GET_FEED_URL =
  'https://us-central1-personal-180010.cloudfunctions.net/getFeed'

const API_URL = 'https://itunes.apple.com'

require('isomorphic-fetch')

function getPrismaUser(ctx, facebookUserId) {
  return ctx.db.query.user({ where: { facebookUserId } })
}

async function createPrismaUser(ctx, facebookUser) {
  const user = await ctx.db.mutation.createUser({
    data: {
      facebookUserId: facebookUser.id,
      email: facebookUser.email
    }
  })
  return user
}

function getUserId(ctx) {
  const Authorization = ctx.request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const { userId } = jwt.verify(token, 'process')

    return userId
  }

  throw new AuthError()
}

const resolvers = {
  Query: {
    show(parent, { id }, ctx, info) {
      return ctx.db.query.show({ where: { id } }, info)
    },
    me(_, args, ctx, info) {
      const id = getUserId(ctx)
      return ctx.db.query.user({ where: { id } }, info)
    }
  },
  Mutation: {
    async getPodcast(parent, { showId }, ctx, info) {
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
    },
    async authenticate(parent, { facebookToken }, ctx, info) {
      const facebookUser = await getFacebookUser(facebookToken)
      let user = await getPrismaUser(ctx, facebookUser.id)

      if (!user) {
        user = await createPrismaUser(ctx, facebookUser)
      }

      const token = jwt.sign({ userId: user.id }, 'process')

      return {
        token,
        user
      }
    }
  }
}

async function getFacebookUser(facebookToken) {
  console.log('✨facebookToken', facebookToken)
  const endpoint = `https://graph.facebook.com/v2.9/me?fields=id%2Cemail&access_token=${facebookToken}`
  const data = await global.fetch(endpoint).then(response => response.json())

  if (data.error) {
    throw new Error(JSON.stringify(data.error))
  }

  return data
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: 'http://localhost:4466/graphcool/dev', // the endpoint of the Prisma DB service
      secret: 'mysecret123', // specified in database/prisma.yml
      debug: true // log all GraphQL queryies & mutations
    })
  })
})

server.start(() => console.log('Server is running on http://localhost:4000'))
