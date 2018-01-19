import { AsyncStorage } from 'react-native'
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-client-preset'
import { setContext } from 'apollo-link-context'
import { ApolloLink } from 'apollo-link'

const DEPLOYED = 'https://api.graph.cool/simple/v1/cj9pp24d42jst0145fvha64ct'

const httpLink = new HttpLink({ uri: 'http://localhost:4000' })

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
