import React from 'react'
import { View, Text, StyleSheet, Platform } from 'react-native'
import { observer, inject } from 'mobx-react'
import { HistoryRow } from '../components/Rows/History'

import { RowContainer } from '../components/Views'
const WEB = Platform.OS === 'web'

export default class History extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'History'
  }

  render() {
    return <HistoryRow horizontal={false} />
  }
}
