import React from 'react'
import { AppRegistry } from 'react-native'
import { Provider as MobxProvider } from 'mobx-react'

import { RootNavigation } from './src/navigation'

import RootStore from './src/stores'
import { client } from './src/apollo'
const stores = RootStore.create()

//debug
if (typeof window !== 'undefined') {
  window.stores = stores
}

class Coolcast extends React.Component {
  render() {
    return (
      <MobxProvider {...stores}>
        <RootNavigation />
      </MobxProvider>
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
