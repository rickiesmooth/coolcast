import HTMLView from 'react-native-htmlview'
import React from 'react'

export { FlatList, Slider } from 'react-native'
export { MaterialIcons } from '@expo/vector-icons'

export const Html = props => {
  return <HTMLView value={props.value} />
}
