import React, { Component } from 'react'
import { computed, observable, action } from 'mobx'
import { observer, inject } from 'mobx-react'
import { Text, Platform } from 'react-native'
import { ShowItem } from '../components/Podcast'
import Header from '../components/Header'
const WEB = Platform.OS === 'web'

@inject('podcastStore')
@observer
export default class PodcastScreen extends Component {
  static navigationOptions = {
    tabBarLabel: 'Search'
  }

  @computed
  get navigationKey() {
    const { match, navigation } = this.props
    return WEB ? match.params.id : navigation.state.params
  }

  render() {
    const { podcastStore } = this.props
    if (this.navigationKey) {
      if (WEB) {
        return <ShowItem showId={this.navigationKey} />
      } else {
        return (
          <Header title={root.currentShow.title}>
            <ShowItem showId={this.navigationKey} />
          </Header>
        )
      }
    } else {
      return <Text>Super long loading</Text>
    }
  }
}
