import React from 'react'
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native'
import { VerticalPaddedView } from '../Views'
import { PodcastEpisodeComposer } from '../../containers/Podcast'
import { AddToPlaylistButton } from '../Playlist'

const Episode = props => {
  const { title, plays, duration, progress, createPlay, episodeId } = props
  return (
    <View>
      <VerticalPaddedView
        style={{ flexDirection: 'row', alignItems: 'center' }}
      >
        <TouchableOpacity onPress={createPlay} style={styles.left}>
          <Text numberOfLines={1}>{transformTitle(title)}</Text>
        </TouchableOpacity>
        <AddToPlaylistButton episodeId={episodeId} />
      </VerticalPaddedView>
      <View
        style={{
          height: 3,
          width: '100%',
          backgroundColor: 'grey',
          borderRadius: 6
        }}
      >
        <View
          style={{
            height: 3,
            width: progress ? `${progress * 100}%` : 0,
            backgroundColor: 'blue',
            borderRadius: 6
          }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  horizontal: {
    flex: 1
  },
  left: {
    flex: 1,
    marginRight: 'auto'
  },
  content: {
    flex: 1
  }
})

const transformTitle = title => {
  let t
  try {
    t = decodeURI(title)
  } catch (e) {
    console.log('✨e', e)
  }
  return t
}

export const EpisodeItem = PodcastEpisodeComposer(Episode)
