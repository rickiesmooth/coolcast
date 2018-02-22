import React from 'react'
import { Platform } from 'react-native'
import { observer } from 'mobx-react'
import { ShowItem } from '../components/Podcast'
import { PageComposer } from '../containers/Page'
import Header from '../components/Header'
const WEB = Platform.OS === 'web'

const PodcastScreen = ({ navigationKey }) => {
  console.log('✨navigationKey', navigationKey)
  return WEB ? (
    <ShowItem showId={navigationKey} />
  ) : (
    <Header title={'currentShow.title'}>
      <ShowItem showId={navigationKey} />
    </Header>
  )
}

export const Podcast = PageComposer(PodcastScreen)

const PodcastHistoryScreen = observer(({ userStore, navigationKey }) => {
  const collection = userStore.userHistoryShow(navigationKey)
  if (collection) {
    console.log('✨collection.title', collection.title)
    return WEB ? (
      <ShowItem showId={navigationKey} episodes={collection.history} />
    ) : (
      <Header title={collection.title}>
        <ShowItem showId={navigationKey} episodes={collection.history} />
      </Header>
    )
  } else {
    return <Text>Super long loading</Text>
  }
})

export const PodcastHistory = PageComposer(PodcastHistoryScreen)
