import React from 'react'
import { View } from 'react-native'
import { Title } from '../../components/Text'
import { ModalContainer } from '../../components/Views'
import { CreatePlaylist, AddToPlaylist } from '../../components/Playlist'

export const FollowModal = ({ navigation, state }) => {
  const { episodeId } = state ? state : navigation.state.params
  return (
    <ModalContainer>
      <Followlist close={navigation.goBack} episodeId={episodeId} />
    </ModalContainer>
  )
}
