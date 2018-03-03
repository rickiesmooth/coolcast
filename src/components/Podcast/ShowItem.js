import React from 'react'
import { Text, View, StyleSheet, Image, ActivityIndicator } from 'react-native'
import { FlatList } from '../../utils'
import { Link } from '../../navigation'
import { Title } from '../Text'
import { ItemHeaderContainer } from '../Views'
import { EpisodeItem } from './EpisodeItem'

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
          height: 90,
          width: 90,
          marginLeft: 'auto'
        }}
      />
    </ItemHeaderContainer>
  </Link>
)

const ShowList = ({ episodes, title, showId, thumbLarge }) => {
  return (
    <FlatList
      data={episodes}
      keyExtractor={({ id }) => id}
      renderItem={({ item }) => {
        const { plays, id, ...rest } = item
        const play = plays[0]
        return (
          <EpisodeItem
            {...rest}
            episodeId={id}
            sessionId={(play && play.id) || null}
            progress={play && play.progress}
            showId={showId}
          />
        )
      }}
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

const ShowCard = ({ episodes, title, showId, thumbLarge }) => {
  const el = episodes.length - 1
  const lastEpisode = episodes[el]
  const { plays, id, ...rest } = lastEpisode

  const play = plays[0]
  return (
    <View
      style={{
        flex: 1,
        position: 'relative',
        flexDirection: 'column'
      }}
    >
      <Header
        title={transformTitle(title)}
        showId={showId}
        thumbLarge={thumbLarge}
      />
      <EpisodeItem
        showId={showId}
        {...rest}
        progress={play && play.progress}
        sessionId={(play && play.id) || null}
        episodeId={lastEpisode.id}
      />
      <Link
        to={`/history/${showId}`}
        style={{
          marginTop: 'auto'
        }}
      >
        <Text>{`${el} more`}</Text>
      </Link>
    </View>
  )
}

export const ShowItem = ({ loading, episodes, card, style, ...rest }) => {
  return (
    <View style={[style, styles.content]}>
      {card ? (
        <ShowCard {...rest} episodes={episodes} />
      ) : (
        <ShowList {...rest} episodes={episodes} />
      )}
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
