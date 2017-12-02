import {
  View,
  Image,
  Text,
  PanResponder,
  ScrollView,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback
} from 'react-native'
import React from 'react'

export const FlatList = function(props) {
  const {
    ItemSeparatorComponent,
    ListFooterComponent,
    ListHeaderComponent,
    contentContainerStyle,
    data,
    horizontal,
    keyExtractor,
    renderItem,
    style
  } = props
  return (
    <ScrollView
      contentContainerStyle={contentContainerStyle}
      style={style}
      horizontal={horizontal}
    >
      {ListHeaderComponent && <ListHeaderComponent />}
      {data.map((item, index) => (
        <View key={keyExtractor ? keyExtractor(item) : index}>
          {renderItem({ index, item })}

          {ItemSeparatorComponent &&
            index < data.length - 1 && <ItemSeparatorComponent />}
        </View>
      ))}
      {ListFooterComponent && <ListFooterComponent />}
    </ScrollView>
  )
}

export const Html = props => (
  <Text dangerouslySetInnerHTML={{ __html: props.value }} />
)

export class Slider extends React.Component {
  // @TODO handle onSlidingComplete in better way > don't set this._val
  _val = 0
  handleChange = e => {
    this._val = e.target.value
    this.props.onValueChange(this._val)
  }
  handleMouseUp = e => {
    this.props.onSlidingComplete(this._val)
  }
  render() {
    const {
      trackImage,
      thumbImage,
      value,
      onValueChange,
      onSlidingComplete,
      disabled,
      style
    } = this.props
    return (
      <input
        type="range"
        min={0}
        max={1}
        step={'any'}
        value={value}
        onChange={this.handleChange}
        onMouseUp={this.handleMouseUp}
      />
    )
  }
}
