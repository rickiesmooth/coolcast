import React from 'react'
import { computed, observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import { ShowItem } from '../components/Podcast'
import Header from '../components/Header'
import { NavigationActions } from 'react-navigation'

@inject('podcastStore')
@observer
export default class PodcastScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    tabBarOnPress: ({ previousScene, scene, jumpToIndex }) => {
      const { route, focused, index } = scene
      if (focused) {
        if (route.index !== 0) {
          navigation.dispatch(NavigationActions.back())
        }
      } else {
        jumpToIndex(index)
      }
    }
  })
  @computed
  get navigationKey() {
    const { navigation } = this.props
    return navigation.state.params
  }

  render() {
    const { podcastStore } = this.props
    console.log('✨this.navigationKey', this.navigationKey)
    if (this.navigationKey) {
      return (
        <Header title={'podcastStore.root.currentShow.title'}>
          <ShowItem showId={this.navigationKey} />
        </Header>
      )
    }
  }
}
