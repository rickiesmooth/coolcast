import React from 'react'
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native'
import { FlatList } from '../../utils'
import { Title } from '../Text'
import { inject, observer } from 'mobx-react'
import { observable, action, computed } from 'mobx'

import { EpisodeItem, ShowItem } from '../Podcast'

@inject('userStore', 'podcastStore')
@observer
export class Row extends React.Component {
  render() {
    const { podcastStore, userStore, data } = this.props
    const { groupedUserHistory, hasHistory } = userStore
    return hasHistory ? (
      <View style={styles.container}>
        <Title text={'Continue listening'} size={'large'} />
        <FlatList
          data={Object.keys(groupedUserHistory)}
          style={styles.listView}
          keyExtractor={item => item}
          horizontal
          renderItem={({ item }) => {
            return (
              <ShowItem
                showId={item}
                episodes={groupedUserHistory[item].episodes.map(ep => ep)}
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
