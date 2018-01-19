import {
  PodcastEpisodeComposer,
  PodcastShowComposer
} from '../../containers/Podcast'
import React from 'react'
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  ActivityIndicator
} from 'react-native'
import { FlatList } from '../../utils'
import { Link } from '../../navigation'
import { Title } from '../Text'
import { LikeButton } from '../Buttons'

const Episode = props => {
  const { title, progress, duration, setCurrentPlaying, liked, likeApi } = props
  return (
    <View>
      <TouchableOpacity onPress={setCurrentPlaying}>
        <Text>{title}</Text>
        {progress && <Text>{progress}</Text>}
      </TouchableOpacity>
      <LikeButton liked={liked} api={likeApi} />
    </View>
  )
}

const EpisodeItem = PodcastEpisodeComposer(Episode)

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
  return (
    <View style={[style, styles.content]}>
      <FlatList
        data={episodes || []}
        keyExtractor={(id, index) => id}
        renderItem={({ item }) => <EpisodeItem episodeId={item.id} />}
        ListHeaderComponent={() => (
          <View>
            <Header title={title} showId={showId} thumbLarge={thumbLarge} />
            {(!episodes || episodes.length < 1) && (
                <ActivityIndicator size={'large'} />
              )}
          </View>
        )}
      />
    </View>
  )
}

export const ShowItem = PodcastShowComposer(Show)

const styles = StyleSheet.create({
  horizontal: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  content: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'green'
  }
})
