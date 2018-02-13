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
  Button,
  ActivityIndicator
} from 'react-native'
import { FlatList, Modal } from '../../utils'
import { Link } from '../../navigation'
import { Title } from '../Text'
import { ItemHeaderContainer } from '../Views'
import {
  PlaylistItemComposer,
  CreatePlaylistComposer,
  AddToPlaylistComposer
} from '../../containers/Playlist'

import { EpisodeItem } from '../../components/Podcast'

const RemovePlaylistButton = ({ playlistId, removePlaylistApi }) => {
  return <Button onPress={removePlaylistApi} title={'remove'} />
}

const Playlist = props => {
  const { name, removePlaylist, episodes, style, id } = props
  return (
    <View style={[style, styles.content]}>
      <FlatList
        data={episodes}
        keyExtractor={({ id }) => id}
        renderItem={({ item }) => <EpisodeItem episodeId={item.id} />}
        ListHeaderComponent={() => (
          <ItemHeaderContainer>
            <Link to={`/playlist/${id}`}>
              <Title text={name} size={'medium'} numberOfLines={1} />
            </Link>
          </ItemHeaderContainer>
        )}
      />
      <RemovePlaylistButton
        playlistId={id}
        removePlaylistApi={removePlaylist}
      />
    </View>
  )
}

export const PlaylistItem = PlaylistItemComposer(Playlist)

const CreatePlaylistComponent = ({ name, create, submit, update, style }) => {
  console.log('✨style', style)
  return (
    <View style={style}>
      <Title text={'New Playlist'} size={'large'} />
      <TextInput
        style={styles.input}
        onChangeText={update}
        placeholder={name}
      />
      <Button onPress={submit} title={name} />
    </View>
  )
}

export const CreatePlaylist = CreatePlaylistComposer(CreatePlaylistComponent)

export const AddToPlaylistComponent = ({
  playlists,
  close,
  addToPlaylist,
  episodeId,
  style
}) => {
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        style={{
          backgroundColor: 'red'
        }}
        data={playlists}
        keyExtractor={({ id }) => id}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity onPress={() => addToPlaylist(item.id, episodeId)}>
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )
        }}
      />
    </View>
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
      <Text>+</Text>
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
  input: {
    fontSize: 48,
    backgroundColor: 'white',
    color: 'grey'
  },
  list: {
    flex: 1,
    borderColor: 'green',
    width: '100%',
    height: '100%'
  },
  content: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'green'
  }
})
