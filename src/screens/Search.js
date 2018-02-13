import React from 'react'
import { View } from 'react-native'
import {
  ComposedSearchInput,
  ComposedSearchResults
} from '../components/Search'
import { RowContainer, Container } from '../components/Views'
export default class Search extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Search'
  }

  render() {
    return (
      <RowContainer>
        <ComposedSearchInput />
        <ComposedSearchResults />
      </RowContainer>
    )
  }
}
