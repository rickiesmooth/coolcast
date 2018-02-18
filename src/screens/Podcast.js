import React from 'react'
import { Platform } from 'react-native'
import { computed, observable, action } from 'mobx'
import { observer, inject } from 'mobx-react'
import { ShowItem } from '../components/Podcast'
import Header from '../components/Header'
const WEB = Platform.OS === 'web'

@inject('podcastStore')
@observer
export default class PodcastScreen extends React.Component {
  @computed
  get navigationKey() {
    const { match, navigation } = this.props
    return match ? match.params.id : navigation.state.params
  }

  render() {
    const { podcastStore } = this.props
    if (this.navigationKey) {
      const currentShow = podcastStore.shows.get(this.navigationKey)
      return WEB ? (
        <ShowItem showId={this.navigationKey} />
      ) : (
        <Header title={currentShow ? currentShow.title : ''}>
          <ShowItem showId={this.navigationKey} />
        </Header>
      )
    } else {
      return <Text>Super long loading</Text>
    }
  }
}
