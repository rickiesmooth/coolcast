import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
export default class ListItem extends React.Component {
  setCurrentPodcast = podcast => {
    this.props.currentStore.setCurrentPlaying(podcast)
  }

  render() {
    const { navigation, podcast } = this.props
    return (
      <TouchableOpacity onPress={() => this.setCurrentPodcast(podcast)}>
        <Text>{podcast.title}</Text>
        <Text>{podcast.description}</Text>
      </TouchableOpacity>
    )
  }
}
