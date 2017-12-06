import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { FlatList } from '../utils'
import { observable, action, computed, reaction } from 'mobx'
import { Search, SearchResults } from '../components/Search'
import { observer, inject } from 'mobx-react'
import { Row } from '../components/Rows'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

@inject('currentStore', 'podcastStore')
@observer
export default class HomeScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Home'
  }

  render() {
    // row history
    // row likes
    // row starred

    return this.props.currentStore.currentUser.history ? (
      <Row data={this.props.currentStore.currentUser.history} />
    ) : null
  }
}
