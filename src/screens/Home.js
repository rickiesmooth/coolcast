import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { observer, inject } from 'mobx-react'
import { Row } from '../components/Rows'

@inject('userStore')
@observer
export default class Home extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Home'
  }

  render() {
    const { userStore } = this.props
    return userStore.hasHistory ? (
      <Row data={userStore.currentUser.history} />
    ) : (
      <Text>No history</Text>
    )
    // row likes
    // row following
  }
}
