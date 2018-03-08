import React from 'react'
import { HomeRows } from '../components/Rows'

export default class Home extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Playlists'
  }

  render() {
    return <HomeRows />
  }
}
