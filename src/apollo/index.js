import { AsyncStorage } from 'react-native'
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-client-preset'
import { setContext } from 'apollo-link-context'
import { ApolloLink } from 'apollo-link'

const URL =
  process.env.SERVER_URL || 'https://hackernews-graphql-js-wypfehbtjp.now.sh'

console.log('✨URL', process.env.SERVER_URL, URL)

const httpLink = new HttpLink({
  uri: 'https://hackernews-graphql-js-wypfehbtjp.now.sh'
})

const authLink = setContext(async (req, { headers }) => {
  const token = await AsyncStorage.getItem('graphcoolToken')
  return {
    ...headers,
    headers: { authorization: token ? `Bearer ${token}` : null }
  }
})

const link = authLink.concat(httpLink)

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
})
