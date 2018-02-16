import React from 'react'
import { View, Text, StyleSheet, Platform } from 'react-native'
import { observer, inject } from 'mobx-react'
import { HistoryRow, PlayListRow } from '../components/Rows'

import { RowContainer, Container } from '../components/Views'
const WEB = Platform.OS === 'web'

// style={{
//   marginTop: IS_IOS ? 20 : 0
// }}

export default class Playlists extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Playlists'
  }

  render() {
    return (
      <RowContainer>
        <PlayListRow horizontal={false} />
      </RowContainer>
    )
  }
}
