import React from 'react'
import { View } from 'react-native'
import { Title } from '../../components/Text'
import { ModalContainer } from '../../components/Views'
import { CreatePlaylist, AddToPlaylist } from '../../components/Playlist'

const c = ({ navigation, close }) =>
  navigation ? () => navigation.goBack() : close

export const CreatePlaylistContent = props => {
  return (
    <ModalContainer>
      <CreatePlaylist close={c(props)} />
    </ModalContainer>
  )
}

export const AddToPlaylistContent = props => {
  const episodeId = props.state && props.state.episodeId
  return (
    <ModalContainer>
      <AddToPlaylist close={c(props)} episodeId={episodeId} />
    </ModalContainer>
  )
}
