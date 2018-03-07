import React from 'react'
import { Platform } from 'react-native'
import { ShowScreen, HistoryScreen } from '../components/Podcast'
import { PageComposer } from '../containers/Page'
import Header from '../components/Header'
const WEB = Platform.OS === 'web'

const Show = props => <ShowScreen showId={props.navigationKey} />

const History = props => <HistoryScreen showId={props.navigationKey} />

export const Podcast = PageComposer(Show)

export const PodcastHistory = PageComposer(History)
