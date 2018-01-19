const { Query } = require('./Query')
const { auth } = require('./Mutation/auth')
const { podcast } = require('./Mutation/podcast')

module.exports = {
  Query,
  Mutation: {
    ...auth,
    ...podcast
  }
}
