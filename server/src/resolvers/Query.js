const { getUserId } = require('../utils')
const getEpisodeId = e => e.episode.id
const getShowId = e => e.episode.show[0].id

const userInfoQuery = `{
  likes {
    id
    episode {
      id
      show {
        showId
      }
    }
  }
  history {
    id
    episode {
      id
      show {
        showId
      }
    }
  }
}`

const userShowQuery = `{
  likes {
    episode {
      show {
        id
        showId
        thumbLarge
        title
      }
    }
  }
  history {
    episode {
      show {
        id
        showId
        thumbLarge
        title
      }
    }
  }
}`

module.exports = {
  shows: async (parent, { id }, ctx, info) => {
    return ctx.db.query.shows({ where: { id } }, info)
  },
  me: async (parent, args, ctx, info) => {
    const id = getUserId(ctx)
    return ctx.db.query.user({ where: { id } }, info)
  },
  userHistoryEpisodes: async (parent, args, ctx, info) => {
    const id = getUserId(ctx)
    const res = await ctx.db.query.user({ where: { id } }, userInfoQuery)
    const { likes, history } = res
    const uniqueEpisodes = [
      ...new Set(likes.map(getEpisodeId).concat(history.map(getEpisodeId)))
    ]
    return ctx.db.query.episodes({ where: { id_in: uniqueEpisodes } }, info)
  },
  userHistoryShows: async (parent, args, ctx, info) => {
    const id = getUserId(ctx)
    const res = await ctx.db.query.user({ where: { id } }, userShowQuery)
    const { likes, history } = res
    const uniqueShows = [
      ...new Set(likes.map(getShowId).concat(history.map(getShowId)))
    ]
    return ctx.db.query.shows({ where: { id_in: uniqueShows } }, info)
  }
}
