import React from 'react'
import { View } from 'react-native'
import {
  ComposedSearchInput,
  ComposedSearchResults
} from '../components/Search'

export default class Search extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Search'
  }

  render() {
    return (
      <View>
        <ComposedSearchInput />
        <ComposedSearchResults />
      </View>
    )
  }
}
