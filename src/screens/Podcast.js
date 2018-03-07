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

// const PodcastHistoryScreen = observer(({ userStore, navigationKey }) => {
//   // const collection = userStore.userHistoryShow(navigationKey)
//   if (collection) {
//     // console.log('✨collection.title', collection.title)
//     return WEB ? (
//       <ShowItem showId={navigationKey} episodes={collection.history} />
//     ) : (
//       <Header title={collection.title}>
//         <ShowItem showId={navigationKey} episodes={collection.history} />
//       </Header>
//     )
//   } else {
//     return <Text>Super long loading</Text>
//   }
// })
