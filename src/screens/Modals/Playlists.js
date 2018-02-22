import React from 'react'
import { View } from 'react-native'
import { Title } from '../../components/Text'
import { ModalContainer } from '../../components/Views'
import { CreatePlaylist, AddToPlaylist } from '../../components/Playlist'

export const CreatePlaylistContent = ({ navigation }) => {
  return (
    <ModalContainer>
      <CreatePlaylist close={navigation.goBack} />
    </ModalContainer>
  )
}

export const AddToPlaylistContent = ({ navigation, state }) => {
  const { episodeId } = state ? state : navigation.state.params
  return (
    <ModalContainer>
      <AddToPlaylist close={navigation.goBack} episodeId={episodeId} />
    </ModalContainer>
  )
}
