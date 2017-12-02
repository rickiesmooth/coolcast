import React from 'react'
import {
  Animated,
  Image,
  Platform,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView
} from 'react-native'

import { observable, computed } from 'mobx'
import { observer, inject } from 'mobx-react'
import ListItem from './ListItem'
@inject('currentStore', 'playerStore')
@observer
export default class EpisodeList extends React.Component {
  @computed
  get currentPodcastEpisodeList() {
    return this.props.currentStore.currentPodcastEpisodeList
  }

  @computed
  get currentPodcastEpisodeMeta() {
    return this.props.currentStore.currentPodcastEpisodeMeta
  }
  render() {
    const data = this.currentPodcastEpisodeList
    switch (this.currentPodcastEpisodeList.state) {
      case 'pending':
        return <Text>Loading documents..</Text>
      case 'rejected':
        return <Text>Loading podcast failed</Text>
      case 'fulfilled':
        return (
          <View style={styles.contentContainer}>
            {this.currentPodcastEpisodeList.value.map((item, i) => (
              <View key={i} style={styles.row}>
                <ListItem
                  currentStore={this.props.currentStore}
                  podcast={item}
                />
              </View>
            ))}
          </View>
        )
    }
  }
}

const styles = StyleSheet.create({
  fill: {
    flex: 1
  },
  title: {
    color: '#333333'
  },
  row: {
    width: null,
    marginBottom: 1,
    padding: 16,
    backgroundColor: 'transparent'
  },
  rowText: {
    color: 'white',
    fontSize: 18
  }
})
