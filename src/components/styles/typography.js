'use strict'

export const fontSize = {
  // heading
  displayLarge: {
    initial: 28,
    tablet: 32,
    desktop: 52
  }, // 32
  displayMedium: {
    initial: 22,
    tablet: 26,
    desktop: 28
  },
  displaySmall: {
    initial: 14,
    tablet: 14,
    desktop: 14
  }, // 20
  heading: 14, // 18
  subheading: 12,

  // body
  body: 18,
  caption: 16
}

export const fontWeight = {
  bold: '700',
  semibold: '500',
  normal: '400',
  light: '200'
}

export const tagMapping = {
  h1: 'displayLarge',
  h2: 'displayMedium',
  h3: 'displaySmall',
  h4: 'heading',
  h5: 'subheading',
  p: 'body'
}

export const lineHeight = {
  // heading
  displayLarge: 1,
  displayMedium: 1,
  displaySmall: 1.5,
  heading: 1.5,
  subheading: 1.5,

  // body
  body: 1.58,
  caption: 1.58
}

// line-height: 1.58;
// font-size: 18px;
