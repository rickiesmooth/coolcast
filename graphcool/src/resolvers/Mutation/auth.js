const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Context } = require('../../utils')

async function createPrismaUser(ctx, facebookUser) {
  const user = await ctx.db.mutation.createUser({
    data: {
      facebookUserId: facebookUser.id,
      email: facebookUser.email
    }
  })
  return user
}

function getPrismaUser(ctx, facebookUserId) {
  return ctx.db.query.user({ where: { facebookUserId } })
}

const auth = {
  async authenticate(parent, { facebookToken }, ctx, info) {
    const fbUser = await getFacebookUser(facebookToken)
    let user = await getPrismaUser(ctx, fbUser.id)

    if (!user) {
      user = await createPrismaUser(ctx, fbUser)
    }
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
    console.log('✨token', token)
    return {
      token,
      user
    }
  }
}

async function getFacebookUser(facebookToken) {
  console.log('✨facebookToken', facebookToken)
  const endpoint = `https://graph.facebook.com/v2.9/me?fields=id%2Cemail&access_token=${facebookToken}`
  const data = await fetch(endpoint).then(response => response.json())

  if (data.error) {
    throw new Error(JSON.stringify(data.error))
  }

  return data
}

module.exports = { auth }
