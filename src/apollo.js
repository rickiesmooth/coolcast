import { AsyncStorage } from 'react-native'

import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-client-preset'
import { setContext } from 'apollo-link-context' // 1.0.0
import { ApolloLink } from 'apollo-link'

import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

const DEPLOYED = 'https://api.graph.cool/simple/v1/cj9pp24d42jst0145fvha64ct'

let token

const getToken = async () => {
  if (token) {
    return Promise.resolve(token)
  }

  token = await AsyncStorage.getItem('graphcoolToken')
  return token
}

const httpLink = new HttpLink({
  uri: DEPLOYED
})

const authLink = setContext(async (req, { headers }) => {
  const token = await getToken()
  return {
    ...headers,
    headers: {
      authorization: token ? `Bearer ${token}` : null
    }
  }
})

const link = authLink.concat(httpLink)

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
})

export default client
