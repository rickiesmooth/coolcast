import React from 'react'
import { View, StyleSheet, Image } from 'react-native'
import { FlatList } from '../../utils'

import { pure, compose } from 'recompose'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import { Title } from '../Text'
import { Container } from '../Views'
import { EpisodeItem, ShowItem } from '../Podcast'
import { HistoryRowComposer } from '../../containers/Page'

import styles from './styles'

export const HistoryComponent = props => {
  const { title, shows, horizontal } = props
  console.log('✨rendingerign HistoryComponent')

  return shows ? (
    <View
      style={[
        styles.container,
        horizontal ? styles.horizontal : styles.vertical
      ]}
    >
      <FlatList
        data={shows}
        style={styles.listView}
        keyExtractor={item => item.showId}
        horizontal={horizontal}
        ListHeaderComponent={() => (
          <Container style={styles.header}>
            <Title
              text={'Continue listenling'}
              size={'large'}
              numberOfLines={1}
            />
          </Container>
        )}
        renderItem={({
          item: { showId, episodes, thumbLarge, title },
          index
        }) => {
          return (
            <ShowItem
              showId={showId}
              episodes={episodes}
              thumbLarge={thumbLarge}
              title={title}
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
