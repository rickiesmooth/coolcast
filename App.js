import React from 'react'

import { AppRegistry, AsyncStorage, View } from 'react-native'
import { ApolloProvider } from 'react-apollo'

import { Provider as MobxProvider, observer, inject } from 'mobx-react'

import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-client-preset'
import { setContext } from 'apollo-link-context' // 1.0.0
import { ApolloLink } from 'apollo-link'

import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import stores from './src/stores'

import client from './src/apollo'

import { RootNavigation } from './src/navigation'

class Coolcast extends React.Component {
  render() {
    console.log('✨log for robert!')
    return (
      <ApolloProvider client={client}>
        <MobxProvider {...stores}>
          <RootNavigation />
        </MobxProvider>
      </ApolloProvider>
    )
  }
}

if (window.document) {
  AppRegistry.registerComponent('Coolcast', () => Coolcast)

  AppRegistry.runApplication('Coolcast', {
    initialProps: {},
    rootTag: document.getElementById('react-app')
  })
}

export default Coolcast
