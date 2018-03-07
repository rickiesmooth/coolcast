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
import {
  PlaylistItemComposer,
  CreatePlaylistComposer,
  AddToPlaylistComposer
} from '../../containers/Playlist'
import { Icon } from '../Icons'

import { EpisodeItem } from '../../components/Podcast'
import { Playlist } from './Item'

export const PlaylistItem = PlaylistItemComposer(Playlist)

const CreatePlaylistComponent = ({ create, submit, update, style }) => {
  return (
    <View style={style}>
      <TextInput
        style={styles.input}
        onChangeText={update}
        placeholder={'Enter playlist name'}
      />
      <Button
        onPress={submit}
        title={'create new playlist'}
        style={{
          borderWidth: 1,
          borderRadius: 50,
          borderColor: 'red'
        }}
      />
    </View>
  )
}

export const CreatePlaylist = CreatePlaylistComposer(CreatePlaylistComponent)

export const AddToPlaylistComponent = ({
  playlists,
  close,
  addToPlaylist,
  episodeId,
  data: { me, loading },
  style
}) => {
  console.log('✨me', me)
  return !loading ? (
    <View
      style={{
        flex: 1
      }}
    >
      <FlatList
        contentContainerStyle={styles.contentContainer}
        data={me.playlists}
        keyExtractor={({ id }) => id}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={{ marginVertical: 5 }}
              onPress={e => addToPlaylist(item.id, e)}
            >
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )
        }}
      />
    </View>
  ) : (
    <ActivityIndicator size={'large'} />
  )
}

export const AddToPlaylist = AddToPlaylistComposer(AddToPlaylistComponent)

export const AddToPlaylistButton = props => {
  return (
    <Link
      to={{
        pathname: '/modal/AddToPlaylist',
        state: { modal: true, episodeId: props.episodeId }
      }}
    >
      <Icon name={'add'} size={24} />
    </Link>
  )
}

export const CreatePlaylistButton = props => (
  <Link
    {...props}
    to={{
      pathname: '/modal/CreatePlaylist',
      state: { modal: true }
    }}
  >
    <Text>create playlist</Text>
  </Link>
)

const styles = StyleSheet.create({
  horizontal: {
    flex: 1
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    fontSize: 48,
    backgroundColor: 'white',
    color: 'grey'
  },
  list: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  content: {
    flex: 1
  }
})
