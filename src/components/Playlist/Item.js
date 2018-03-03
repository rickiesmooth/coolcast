import {
  PodcastEpisodeComposer,
  PodcastShowComposer
} from '../../containers/Podcast'
import React from 'react'
import {
  Text,
  TouchableOpacity,
  TextInput,
  View,
  StyleSheet,
  Image,
  ActivityIndicator
} from 'react-native'
import { FlatList, Modal } from '../../utils'
import { Link } from '../../navigation'
import { Title } from '../Text'
import { Button } from '../Buttons'
import { ItemHeaderContainer } from '../Views'

import { EpisodeItem } from '../../components/Podcast'

const RemovePlaylistButton = ({ playlistId, removePlaylistApi }) => {
  return <Button onPress={removePlaylistApi} title={'remove'} />
}

export const Playlist = props => {
  const {
    name,
    removePlaylist,
    editPlaylist,
    style,
    playlistId,
    data: { loading, playlist },
    editing
  } = props
  return !loading ? (
    <View style={[style, styles.content]}>
      <FlatList
        data={playlist.episodes}
        keyExtractor={({ id }) => id}
        renderItem={({ item }) => <EpisodeItem {...item} />}
        ListHeaderComponent={() => (
          <ItemHeaderContainer>
            <View>
              <Link to={`/playlist/${playlistId}`}>
                <Title text={name} size={'medium'} numberOfLines={1} />
              </Link>
              <Link to={`/user/${playlist.user.id}`}>
                <Text>{playlist.user.name}</Text>
              </Link>
            </View>
            <Button
              title={editing ? 'Done' : 'Edit'}
              onPress={editPlaylist}
              style={{
                marginLeft: 'auto'
              }}
            />
          </ItemHeaderContainer>
        )}
      />
      {editing && (
        <RemovePlaylistButton
          playlistId={playlistId}
          removePlaylistApi={removePlaylist}
        />
      )}
    </View>
  ) : (
    <ActivityIndicator size={'large'} />
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1
  }
})
