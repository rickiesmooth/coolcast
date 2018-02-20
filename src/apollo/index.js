import { AsyncStorage } from 'react-native'
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-client-preset'
import { setContext } from 'apollo-link-context'
import { ApolloLink } from 'apollo-link'

const URL =
  process.env.API_URL || 'https://hackernews-graphql-js-wypfehbtjp.now.sh'

console.log(
  '✨URL',
  process.env.REACT_NATIVE_ENVIRONMENT_CURRENT,
  process.env.API_URL,
  URL
)

const httpLink = new HttpLink({ uri: 'http://192.168.1.241:4000' })

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
