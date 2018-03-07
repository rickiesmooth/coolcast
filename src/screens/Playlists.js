import React from 'react'
import { View, Text, StyleSheet, Platform } from 'react-native'
import { observer, inject } from 'mobx-react'
import { PlaylistRow } from '../components/Rows/Playlist'

import { RowContainer, Container } from '../components/Views'

export default class Playlists extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Playlists'
  }

  render() {
    return (
      <RowContainer>
        <PlaylistRow horizontal={false} />
      </RowContainer>
    )
  }
}
