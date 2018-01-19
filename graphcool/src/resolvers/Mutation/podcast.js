const { getUserId, Context } = require('../../utils')

const podcast = {
  async createDraft(parent, { title, text }, ctx, info) {
    const userId = getUserId(ctx)
    return ctx.db.mutation.createPodcast(
      {
        data: {
          title,
          text,
          isPublished: false,
          author: {
            connect: { id: userId }
          }
        }
      },
      info
    )
  },

  async getPodcast(parent, { showId }, ctx, info) {
    console.log('✨hoi', showId)
    // const podcastExists = await ctx.db.exists.Podcast({
    //   showId
    // })
    const podcast = await ctx.db.query.podcast({ where: { showId } }, info)
    console.log('✨podcast', podcast)
    return {
      title: 'ajaj'
    }

    // const podcast = await ctx.db.query.show({ where: { showId } })
    // console.log('✨podcastExists', podcast)
    // // return podcastExists
    // if (!podcast) {
    //   return ctx.db.mutation.createPodcast(
    //     {
    //       data: {
    //         title: 'title'
    //       }
    //     },
    //     info
    //   )
    //   // throw new Error(`Podcast not found or you're not the author`)
    // }

    // return ctx.db.mutation.updatePodcast(
    //   {
    //     where: { id },
    //     data: { isPublished: true }
    //   },
    //   info
    // )
  }
}

module.exports = { podcast }
