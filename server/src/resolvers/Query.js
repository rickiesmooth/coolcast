const { getUserId } = require('../utils')

module.exports = {
  shows: async (parent, { id }, ctx, info) => {
    return ctx.db.query.shows({ where: { showId: id } }, info)
  },
  me: async (parent, args, ctx, info) => {
    const id = getUserId(ctx)
    return ctx.db.query.user({ where: { id } }, info)
  },
  plays: async (parent, args, ctx, info) => {
    const id = getUserId(ctx)
    return ctx.db.query.podcastPlays(null, '{ id }')
  }
}
