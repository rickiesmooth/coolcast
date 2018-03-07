import React from 'react'
import { View } from 'react-native'
import { Title } from '../../components/Text'
import { ModalContainer } from '../../components/Views'
import { FollowModal } from '../../components/Profile'

export const FollowContent = props => {
  const { navigation, state } = props
  const { following, followers } = state ? state : navigation.state.params
  return (
    <ModalContainer>
      <FollowModal
        close={navigation.goBack}
        userId={following || followers}
        followers={!!followers}
        following={!!following}
      />
    </ModalContainer>
  )
}
