import React from 'react'
import { computed, observable, action } from 'mobx'
import { observer, inject } from 'mobx-react'
import { ShowItem } from '../components/Podcast'
// import { NavigationActions } from 'react-navigation'

@inject('podcastStore')
@observer
export default class PodcastScreen extends React.Component {
  @computed
  get navigationKey() {
    const { match } = this.props
    return match.params.id
  }

  render() {
    const { podcastStore } = this.props
    if (this.navigationKey) {
      return <ShowItem showId={this.navigationKey} />
    } else {
      return <Text>Super long loading</Text>
    }
  }
}
