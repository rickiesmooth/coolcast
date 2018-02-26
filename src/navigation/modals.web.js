import React from 'react'
import { View, Text, TextInput, Button, Animated } from 'react-native'
import { Route } from 'react-router-dom'
import {
  CreatePlaylistContent,
  AddToPlaylistContent
} from '../screens/Modals/Playlists'

import { FollowContent } from '../screens/Modals/Profile'

export class ModalComponent extends React.Component {
  state = {
    fadeAnim: new Animated.Value(0) // Initial value for opacity: 0
  }
  componentDidMount() {
    Animated.timing(this.state.fadeAnim, {
      toValue: 0.99,
      duration: 500
    }).start()
  }
  back = e => {
    e && e.stopPropagation()
    Animated.timing(this.state.fadeAnim, {
      toValue: 0,
      duration: 500
    }).start(this.props.history.goBack)
  }
  render() {
    const { match, location } = this.props
    let { fadeAnim } = this.state
    return (
      <Animated.View
        style={{
          backgroundColor: 'rgb(255, 255, 255)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: 9999,
          opacity: fadeAnim
        }}
      >
        <Button title="close" onPress={this.back} />
        <ModalContent
          content={match.params.id}
          state={location.state}
          navigation={{
            goBack: () => this.back()
          }}
        />
      </Animated.View>
    )
  }
}

export const ModalContent = ({ content, ...rest }) => {
  switch (content) {
    case 'AddToPlaylist':
      return <AddToPlaylistContent {...rest} />
    case 'CreatePlaylist':
      return <CreatePlaylistContent {...rest} />
    case 'Follow':
      return <FollowContent {...rest} />

    default:
      return <Text>Not found</Text>
  }
}

export const ModalRoute = ({ isModal, ...rest }) => {
  return isModal ? (
    <Route {...rest} render={props => <ModalComponent {...props} />} />
  ) : null
}
