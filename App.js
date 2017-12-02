import React from 'react'
import { AppRegistry } from 'react-native'
import { ApolloProvider } from 'react-apollo'
import { Provider as MobxProvider } from 'mobx-react'

import stores from './src/stores'
import client from './src/apollo'
import { RootNavigation } from './src/navigation'

class Coolcast extends React.Component {
  render() {
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
