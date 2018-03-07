import React from 'react'
import { View, Button } from 'react-native'
import { FlatList } from '../../utils'

import { pure, compose } from 'recompose'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import { PlaylistItem, CreatePlaylistButton } from '../Playlist'
import { Container } from '../Views'
import { Title } from '../Text'
import { PlaylistRowComposer } from '../../containers/Page'

import styles from './styles'

export const PlaylistComponent = props => {
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
              playlistId={item.id}
              user={item.user}
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
export const PlaylistRow = PlaylistRowComposer(PlaylistComponent)
