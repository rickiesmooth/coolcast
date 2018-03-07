import { AsyncStorage } from 'react-native'
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-client-preset'
import { setContext } from 'apollo-link-context'
import { ApolloLink } from 'apollo-link'

function toIdValue(id, generated = false) {
  return {
    type: 'id',
    id,
    generated
  }
}

const httpLink = new HttpLink({
  uri: 'http://192.168.1.16:4000' || 'https://coolcast-server.now.sh'
})

const authLink = setContext(async (req, { headers }) => {
  const token = await AsyncStorage.getItem('graphcoolToken')
  return {
    ...headers,
    headers: { authorization: token ? `Bearer ${token}` : null }
  }
})

const link = authLink.concat(httpLink)

const cache = new InMemoryCache({
  cacheResolvers: {
    Query: {
      playlists: (_, args) =>
        toIdValue(
          cache.config.dataIdFromObject({ __typename: 'Playlist', id: args.id })
        ),
      user: (_, args) =>
        toIdValue(
          cache.config.dataIdFromObject({ __typename: 'User', id: args.id })
        )
    }
  }
})

export const client = new ApolloClient({
  link,
  cache
})
