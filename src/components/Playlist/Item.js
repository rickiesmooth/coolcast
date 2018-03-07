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
  Image
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
    episodes,
    user,
    editing
  } = props
  return (
    <View style={[style, styles.content]}>
      <FlatList
        data={episodes}
        keyExtractor={({ id }) => id}
        renderItem={({ item }) => <EpisodeItem {...item} />}
        ListHeaderComponent={() => (
          <ItemHeaderContainer>
            <View>
              <Link to={`/playlist/${playlistId}`}>
                <Title text={name} size={'medium'} numberOfLines={1} />
              </Link>
              <Link to={`/user/${user.id}`}>
                <Text>{user.name}</Text>
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
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1
  }
})
