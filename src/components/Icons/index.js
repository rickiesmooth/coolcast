import React from 'react'
import Svg, { Path } from 'svgs'

const PlayIcon = props => {
  const { name, color, size } = props
  return (
    <Svg height={size} width={size} viewBox={`0 0 24 24`}>
      <Path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
    </Svg>
  )
}

const PauseIcon = props => {
  const { name, color, size } = props
  return (
    <Svg height={size} width={size} viewBox={`0 0 24 24`}>
      <Path d="M9 16h2V8H9v8zm3-14C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-4h2V8h-2v8z" />
    </Svg>
  )
}

const AddIcon = props => {
  const { name, color, size } = props
  return (
    <Svg height={size} width={size} viewBox={`0 0 24 24`}>
      <Path d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z" />
      <Path d="M0 0h24v24H0z" fill="none" />
    </Svg>
  )
}

const iconMap = {
  pause: PauseIcon,
  play: PlayIcon,
  add: AddIcon
}

export const Icon = props => {
  const { name, color, size } = props
  const Target = iconMap[name]
  if (Target) {
    return <Target size={size} color={color} />
  } else {
    console.error('icon not found')
  }
}
