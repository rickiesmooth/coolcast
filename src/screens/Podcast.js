import React, { Component } from 'react'
import { computed, observable, action } from 'mobx'
import { observer, inject } from 'mobx-react'
import { Text, Platform } from 'react-native'
import { ShowItem } from '../components/Podcast'
import Header from '../components/Header'
const WEB = Platform.OS === 'web'

@inject('viewStore', 'podcastStore')
@observer
export default class PodcastScreen extends Component {
  static navigationOptions = {
    tabBarLabel: 'Search'
  }

  @observable showId = null
  @observable episodes = []

  @computed
  get navigationKey() {
    const { match, navigation } = this.props
    return WEB ? match.params.id : navigation.state.params
  }

  @action
  async prepareData(id) {
    const podcastStore = this.props.podcastStore
    this.showId = await podcastStore.getShow(id)
    const episodes = await podcastStore.getPodcastEpisodes(id)
    this.episodes = episodes.map(e => e.id)
  }

  componentWillReceiveProps({ match, navigation }) {
    const id = WEB ? match.params.id : navigation.state.params
    this.prepareData(id)
  }

  componentWillMount(props) {
    this.prepareData(this.navigationKey)
  }

  render() {
    const { podcastStore, viewStore } = this.props
    const root = podcastStore.root
    if (this.showId) {
      if (WEB) {
        return <ShowItem showId={this.showId} episodes={this.episodes} />
      } else {
        return (
          <Header title={root.currentShow.title}>
            <ShowItem showId={this.showId} episodes={this.episodes} />
          </Header>
        )
      }
    } else {
      return <Text>Super long loading</Text>
    }
  }
}
