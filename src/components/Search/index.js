import React from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  Platform,
  Image,
  Text
} from 'react-native'
import { computed, action, when } from 'mobx'
import { observer, inject } from 'mobx-react'

import { FlatList } from '../../utils'
import { Link } from '../../navigation'
import { Title, Subline } from '../Text'
import {
  SearchInputComposer,
  SearchResultsComposer
} from '../../containers/Search'

const SearchInput = props => {
  const { query, onTextInputChange, toggleSearchResults, placeholder } = props
  return (
    <View style={styles.search}>
      <TextInput
        value={query}
        style={styles.input}
        onChangeText={onTextInputChange}
        onFocus={() => toggleSearchResults(false)}
        onBlur={e => {
          // @TODO find correct solution for onblur firing before on mouseup/click
          setTimeout(() => {
            toggleSearchResults(true)
          }, 250)
        }}
        placeholder={placeholder}
      />
    </View>
  )
}

const SearchResults = props => {
  const { results, style, setCurrentPodcast } = props
  return (
    <FlatList
      data={results}
      style={style}
      keyExtractor={(item, index) => item.key}
      renderItem={({ item }) => (
        <ListItem podcast={item} setCurrentPodcast={setCurrentPodcast} />
      )}
    />
  )
}

const ListItem = props => {
  const { podcast, setCurrentPodcast } = props
  return (
    <Link
      onClick={() => {
        setCurrentPodcast(podcast)
      }}
      to={`/podcast/${podcast.key}`}
    >
      <View style={styles.container}>
        <Image style={styles.image} source={{ uri: podcast.thumb }} />
        <Title
          text={podcast.title}
          size={'small'}
          style={{
            color: 'black'
          }}
        />
      </View>
    </Link>
  )
}

const ComposedSearchInput = SearchInputComposer(SearchInput)
const ComposedSearchResults = SearchResultsComposer(SearchResults)

export { ComposedSearchInput, ComposedSearchResults }

const styles = StyleSheet.create({
  search: {
    margin: Platform.OS === 'web' ? 0 : 15
  },
  input: {
    fontSize: Platform.OS === 'web' ? 'inherit' : 48,
    backgroundColor: 'white',
    color: 'grey'
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5
  },
  image: {
    height: 40,
    width: 40
  }
})
