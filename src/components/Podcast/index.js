import {
  PodcastEpisodeComposer,
  PodcastShowComposer
} from '../../containers/Podcast'
import React from 'react'
import { Text, TouchableOpacity, View, StyleSheet, Image } from 'react-native'
import { FlatList } from '../../utils'
import { Link } from '../../navigation'
import { Title } from '../Text'

const Episode = props => {
  const { title, progress, setCurrentPlaying } = props
  return (
    <TouchableOpacity onPress={setCurrentPlaying}>
      <Text>{title}</Text>
      {progress && <Text>{progress}</Text>}
    </TouchableOpacity>
  )
}

const EpisodeItem = PodcastEpisodeComposer(Episode)
console.log('✨haha')
export { EpisodeItem }

const Header = props => {
  const { thumbLarge, title, showId, setCurrentPodcast } = props
  return (
    <Link onClick={setCurrentPodcast} to={`/podcast/${showId}`}>
      <Title text={title} size={'medium'} numberOfLines={1} />
      <Image
        source={{ uri: thumbLarge }}
        style={{
          height: 50,
          width: 50
        }}
      />
    </Link>
  )
}

const Show = props => {
  const { title, episodes, thumbLarge, showId, style } = props
  if (!episodes) {
    return <Header title={title} showId={showId} thumbLarge={thumbLarge} />
  } else {
    return (
      <View style={[style, styles.content]}>
        <FlatList
          data={episodes}
          keyExtractor={(id, index) => id}
          renderItem={({ item }) => <EpisodeItem episodeId={item} />}
          ListHeaderComponent={() => (
            <Header title={title} showId={showId} thumbLarge={thumbLarge} />
          )}
        />
      </View>
    )
  }
}

export const ShowItem = PodcastShowComposer(Show)

const styles = StyleSheet.create({
  content: {
    padding: 15,
    flex: 1,
    borderWidth: 1,
    borderColor: 'green'
  }
})
