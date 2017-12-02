import React, { Component } from 'react'
import { computed } from 'mobx'
import { observer, inject } from 'mobx-react'
import { Text, Platform } from 'react-native'
import { ShowItem } from '../components/Podcast'
import Header from '../components/Header'

@inject('currentStore', 'podcastStore')
@observer
export default class PodcastScreen extends Component {
  static navigationOptions = {
    tabBarLabel: 'Search'
  }

  async componentWillMount() {
    // for landing on podcast
    // probably doesnt work for iOS
    const { podcastStore, currentStore } = this.props
    if (this.props.match) {
      const key = this.props.match.params.id
      currentStore.setCurrentPodcast({ key })
    }
  }

  render() {
    const { podcastStore, currentStore } = this.props
    if (Platform.OS === 'web') {
      return <ShowItem showId={currentStore.currentPodcast} />
    } else {
      return (
        <Header title={'podcast.title'}>
          <ShowItem showId={currentStore.currentPodcast} />
        </Header>
      )
    }
  }
}
