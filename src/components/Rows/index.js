import React from 'react'
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native'
import { FlatList } from '../../utils'
import { Title } from '../Text'
import { inject, observer } from 'mobx-react'
import { observable, action, computed } from 'mobx'

import { EpisodeItem, ShowItem } from '../Podcast'

@inject('currentStore', 'podcastStore', 'userStore')
@observer
export class Row extends React.Component {
  @observable history = []

  @computed
  get userHistory() {
    const { podcastStore, userStore, data } = this.props
    const history = userStore.currentUserHistory
    return Object.keys(history).reduce((r, a) => {
      const show = history[a].show
      r[show.showId] = r[show.showId] || {}
      r[show.showId].id = show.id
      r[show.showId].episodes = r[show.showId].episodes || []
      r[show.showId].episodes.push(history[a])
      return r
    }, {})
  }

  @action
  updateHistory(history) {
    this.history = history
  }

  async componentDidMount() {
    const { podcastStore, data } = this.props
    const history = await podcastStore.currentUserHistory(this.userHistory)
    this.updateHistory(history)
  }

  render() {
    return this.history ? (
      <View style={styles.container}>
        <Title text={'Continue listening'} size={'large'} />
        <FlatList
          data={this.history}
          style={styles.listView}
          keyExtractor={(item, index) => item.key}
          horizontal
          renderItem={({ item }) => {
            return (
              <ShowItem
                showId={item.key}
                episodes={this.userHistory[item.key].episodes.map(ep => ep.id)}
                style={{
                  width: 250
                }}
              />
            )
          }}
        />
      </View>
    ) : null
  }
}

const styles = StyleSheet.create({
  container: {
    height: 250,
    width: '100%',
    borderColor: 'rgba(0, 0, 0, 0.15)',
    borderWidth: 1
  },
  listView: {
    backgroundColor: '#eee'
  }
})

// get by ShowId
// get by episodeId
