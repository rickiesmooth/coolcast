import { Text, StyleSheet } from 'react-native'
import React from 'react'
import { spacing } from '../styles/spacing'

import {
  tagMapping,
  fontSize,
  fontWeight,
  lineHeight
} from '../styles/typography'

export class Title extends React.Component {
  render() {
    const { text, size, style, numberOfLines } = this.props
    return (
      <Text
        numberOfLines={numberOfLines}
        style={[styles.Title, styles[size], style]}
      >
        {text}
      </Text>
    )
  }
}

export class Subline extends React.Component {
  render() {
    const { text, size, style, numberOfLines } = this.props
    return (
      <Text
        numberOfLines={numberOfLines}
        style={[styles.Subline, styles[size], style]}
      >
        {text}
      </Text>
    )
  }
}

const styles = StyleSheet.create({
  Subline: {
    color: 'rgba(162,164,181,.8)',
    fontWeight: fontWeight.light
  },
  Description: {
    maxWidth: 630
  },
  large: {
    fontSize: fontSize.displayLarge.initial,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.displayLarge.initial * lineHeight.displayLarge
  },
  medium: {
    fontSize: fontSize.displayMedium.initial,
    fontWeight: fontWeight.normal,
    lineHeight: fontSize.displayMedium.initial * lineHeight.displayLarge
  },
  small: {
    fontSize: fontSize.displaySmall.initial,
    lineHeight: fontSize.displaySmall.initial * lineHeight.displaySmall
  },
  heading: {
    fontSize: fontSize.heading,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.heading
  },
  subheading: {
    fontSize: fontSize.subheading,
    fontWeight: fontWeight.light,
    lineHeight: lineHeight.subheading
  }
})
