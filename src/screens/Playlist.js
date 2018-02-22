import React from 'react'
import { PlaylistItem } from '../components/Playlist'
import { PageComposer } from '../containers/Page'

const PlaylistScreen = props => <PlaylistItem id={props.navigationKey} />

export default PageComposer(PlaylistScreen)
