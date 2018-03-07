import React from 'react'
import { ComposedSearchInputWithResults } from '../components/Search'

export default class Search extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Search'
  }

  render() {
    return <ComposedSearchInputWithResults />
  }
}
