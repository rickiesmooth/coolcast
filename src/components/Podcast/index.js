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
import { AddToPlaylistButton } from '../Playlist'
import { ItemHeaderContainer } from '../Views'
import {
  PodcastEpisodeComposer,
  PodcastShowComposer
} from '../../containers/Podcast'

const Episode = ({
  title,
  progress,
  duration,
  setCurrentPlaying,
  liked,
  likeApi,
  id
}) => {
  return (
    <View style={{ marginHorizontal: 15 }}>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={setCurrentPlaying} style={styles.left}>
          <Text numberOfLines={1}>{title}</Text>
        </TouchableOpacity>
        <AddToPlaylistButton episodeId={id} />
      </View>
      <View
        style={{
          width: '100%',
          marginVertical: 15,
          backgroundColor: 'grey',
          borderRadius: 50
        }}
      >
        <View
          style={{
            width: `${progress * 100}%`,
            backgroundColor: 'blue',
            height: 5,
            borderRadius: 60
          }}
        />
      </View>
    </View>
  )
}

const EpisodeItem = PodcastEpisodeComposer(Episode)

export { EpisodeItem }

const Header = ({ thumbLarge, title, showId, setCurrentPodcast }) => (
  <Link to={`/podcast/${showId}`}>
    <ItemHeaderContainer>
      <Title
        style={{
          alignSelf: 'center'
        }}
        text={title}
        size={'medium'}
        numberOfLines={2}
      />
      <Image
        source={{ uri: thumbLarge }}
        style={{
          height: 50,
          width: 50,
          marginLeft: 'auto'
        }}
      />
    </ItemHeaderContainer>
  </Link>
)

const ShowBody = ({ episodes, title, showId, thumbLarge, card }) => {
  console.log('✨card', card)
  const el = episodes.length - 1
  return card ? (
    <View>
      <Header title={title} showId={showId} thumbLarge={thumbLarge} />
      <EpisodeItem episodeId={episodes[el].id} />
      <Link to={`/history/${showId}`}>
        <Text>{`${el} more`}</Text>
      </Link>
    </View>
  ) : (
    <FlatList
      data={episodes}
      keyExtractor={(id, index) => id}
      renderItem={({ item }) => <EpisodeItem episodeId={item.id} />}
      ListHeaderComponent={() => (
        <View>
          <Header title={title} showId={showId} thumbLarge={thumbLarge} />
          {(!episodes || episodes.length < 1) && (
              <ActivityIndicator style={styles.horizontal} size={'large'} />
            )}
        </View>
      )}
    />
  )
}

const Show = ({ loading, episodes, style, ...rest }) => {
  return (
    <View style={[style, styles.content]}>
      {loading || !episodes ? (
        <ActivityIndicator style={styles.horizontal} size={'large'} />
      ) : (
        <ShowBody {...rest} episodes={episodes} />
      )}
    </View>
  )
}

export const ShowItem = PodcastShowComposer(Show)

const styles = StyleSheet.create({
  horizontal: {
    flex: 1
  },
  left: {
    flex: 1,
    marginRight: 'auto'
  },
  content: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'green'
  }
})
