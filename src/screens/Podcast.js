import React from 'react'
import { Platform, Text } from 'react-native'
import { computed, observable, action } from 'mobx'
import { observer, inject } from 'mobx-react'
import { ShowItem } from '../components/Podcast'
import Header from '../components/Header'
const WEB = Platform.OS === 'web'

@inject('podcastStore')
@observer
export class Podcast extends React.Component {
  @computed
  get navigationKey() {
    const { match, navigation } = this.props
    console.log('✨match', match)
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

@inject('userStore')
@observer
export class PodcastHistory extends React.Component {
  @computed
  get navigationKey() {
    const { match, navigation } = this.props
    console.log('✨match', match)
    return match ? match.params.id : navigation.state.params
  }

  @computed
  get userHistory() {
    const { match, navigation, userStore } = this.props
    return (
      userStore.currentUser &&
      userStore.currentUser.history &&
      userStore.currentUser.history.length &&
      userStore.currentUser.history.find(show => show.id === this.navigationKey)
    )
  }

  render() {
    if (this.userHistory) {
      return WEB ? (
        <ShowItem
          showId={this.navigationKey}
          episodes={this.userHistory.history}
        />
      ) : (
        <Header title={this.userHistory.title}>
          <ShowItem
            showId={this.navigationKey}
            episodes={this.userHistory.history}
          />
        </Header>
      )
    } else {
      return <Text>Super long loading</Text>
    }
  }
}
