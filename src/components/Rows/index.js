import React from 'react'
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Image,
  Button,
  TouchableOpacity
} from 'react-native'
import { FlatList } from '../../utils'
import { Title } from '../Text'
import { inject, observer } from 'mobx-react'
import { observable, action, computed } from 'mobx'

import { EpisodeItem, ShowItem } from '../Podcast'
import { PlaylistItem, CreatePlaylistButton } from '../Playlist'
import { Container } from '../Views'
import { HistoryRowComposer, PlaylistRowComposer } from '../../containers/Row'

const HistoryComponent = props => {
  const { hasHistory, title, shows, episodes, horizontal } = props
  return hasHistory ? (
    <View
      style={[
        styles.container,
        horizontal ? styles.horizontal : styles.vertical
      ]}
    >
      <FlatList
        data={shows}
        style={styles.listView}
        keyExtractor={item => item.id}
        horizontal={horizontal}
        ListHeaderComponent={() => (
          <Container style={styles.header}>
            <Title text={title} size={'large'} numberOfLines={1} />
          </Container>
        )}
        renderItem={({ item, index }) => {
          return (
            <ShowItem
              showId={item.id}
              episodes={item.history}
              card={true}
              style={[
                horizontal ? styles.horizontalItem : styles.verticalItem,
                horizontal && index === 0 && styles.firstRowItem
              ]}
            />
          )
        }}
      />
    </View>
  ) : null
}

export const HistoryRow = HistoryRowComposer(HistoryComponent)

const PlaylistComponent = props => {
  const { hasPlaylists, title, playlists, createPlaylist, horizontal } = props
  return hasPlaylists ? (
    <View
      style={[
        styles.container,
        horizontal ? styles.horizontal : styles.vertical
      ]}
    >
      <FlatList
        data={playlists}
        style={styles.listView}
        keyExtractor={item => item.id}
        horizontal={horizontal}
        ListHeaderComponent={() => (
          <Container style={styles.header}>
            <Title
              text={'Playlists'}
              size={'large'}
              style={{
                marginRight: 'auto'
              }}
            />
            <CreatePlaylistButton
              style={{
                marginLeft: 'auto'
              }}
            />
          </Container>
        )}
        renderItem={({ item, index }) => {
          return (
            <PlaylistItem
              name={item.name}
              id={item.id}
              author={item.author}
              episodes={item.episodes}
              style={[
                horizontal ? styles.horizontalItem : styles.verticalItem,
                horizontal && index === 0 && styles.firstRowItem
              ]}
            />
          )
        }}
      />
    </View>
  ) : (
    <CreatePlaylistButton />
  )
}

export const PlayListRow = PlaylistRowComposer(PlaylistComponent)

const styles = StyleSheet.create({
  container: {
    width: '100%'
  },
  horizontal: {
    height: 250,
    flexDirection: 'column'
  },
  horizontalItem: {
    width: 250,
    marginRight: 20
  },
  verticalItem: {
    height: 250,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.15)',
    marginBottom: 20,
    marginHorizontal: 20
  },
  firstRowItem: {
    marginLeft: 20
  },
  vertical: {
    flexDirection: 'row'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  listView: {
    backgroundColor: '#f9f9f9'
  }
})

// get by ShowId
// get by episodeId
