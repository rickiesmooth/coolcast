import React from 'react'
import Svg, { Path } from 'svgs'

const PlayIcon = props => {
  const { name, color, size } = props
  return (
    <Svg height={size} width={size} viewBox={`0 0 ${size} ${size}`}>
      <Path d="M20.082 10.475c1.063 0.684 1.063 2.368 0 3.048l-15.663 10.035c-0.692 0.444-1.564-0.104-1.564-0.983v-21.15c0-0.879 0.872-1.427 1.564-0.983l15.663 10.033z" />
    </Svg>
  )
}

const PauseIcon = props => {
  const { name, color, size } = props
  return (
    <Svg height={size} width={size} viewBox={`0 0 ${size} ${size}`}>
      <Path d="M4.154 0c-0.765 0-1.385 0.617-1.385 1.377v21.247c0 0.76 0.615 1.377 1.385 1.377 0.765 0 1.385-0.617 1.385-1.377v-21.247c0-0.76-0.615-1.377-1.385-1.377zM19.846 0c-0.765 0-1.385 0.617-1.385 1.377v21.247c0 0.76 0.615 1.377 1.385 1.377 0.765 0 1.385-0.617 1.385-1.377v-21.247c0-0.76-0.615-1.377-1.385-1.377z" />
    </Svg>
  )
}

const iconMap = {
  pause: PauseIcon,
  play: PlayIcon
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
