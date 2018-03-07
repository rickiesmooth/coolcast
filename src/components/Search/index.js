import React from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  Platform,
  Dimensions,
  Image,
  TouchableOpacity,
  Text
} from 'react-native'
import { computed, action, when } from 'mobx'
import { observer, inject } from 'mobx-react'
import { FlatList } from '../../utils'
import { Link } from '../../navigation'
import { Title, Subline } from '../Text'
import {
  SearchInputComposer,
  SearchResultsComposer,
  SearchInputWithResultsComposer
} from '../../containers/Search'

const inString = (s, q) => s.toLowerCase().includes(q.toLowerCase())

const SearchInput = props => {
  const { query, toggleSearchResults, onInput, placeholder } = props
  return (
    <View style={styles.search}>
      <TextInput
        value={query}
        style={styles.input}
        onChangeText={onInput}
        onFocus={toggleSearchResults ? () => toggleSearchResults(false) : null}
        onBlur={
          toggleSearchResults
            ? e => {
                // @TODO find correct solution for onblur firing before on mouseup/click
                setTimeout(() => {
                  toggleSearchResults(true) //
                }, 250)
              }
            : null
        }
        placeholder={placeholder}
      />
    </View>
  )
}

const SearchResults = props => {
  const { results, style, setCurrentPodcast } = props
  const hasResults = results.length > 0
  return hasResults ? (
    <FlatList
      data={results}
      style={style}
      keyExtractor={(item, index) => item.id}
      renderItem={({ item }) => {
        return <ListItem podcast={item} setCurrentPodcast={setCurrentPodcast} />
      }}
    />
  ) : null
}

const SearchInputWithResults = props => {
  const { toggleSearchResults, hidden, results, onInput, query } = props

  return (
    <View style={styles.searchInput}>
      <SearchInput
        toggleSearchResults={toggleSearchResults}
        results={results}
        query={query}
        onInput={onInput}
      />
      {!hidden && (
        <SearchResults
          style={styles.results}
          results={Object.values(query ? results : []).filter(r =>
            inString(r.title, query)
          )}
        />
      )}
    </View>
  )
}

const ListItem = props => {
  const { podcast, setCurrentPodcast } = props
  return (
    <Link to={`/podcast/${podcast.id}`}>
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

const ComposedSearchInputWithResults = SearchInputWithResultsComposer(
  SearchInputWithResults
)

const ComposedSearchInput = SearchInputComposer(SearchInput)
const ComposedSearchResults = SearchResultsComposer(SearchResults)

export {
  ComposedSearchInput,
  ComposedSearchResults,
  ComposedSearchInputWithResults
}

const styles = StyleSheet.create({
  search: {
    margin: Platform.OS === 'web' ? 0 : 15
  },
  searchInput: {
    width: Dimensions.get('window').width > 550 ? 400 : '100%',
    position: 'relative',
    borderColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 3,
    padding: 5,
    borderWidth: 1,
    overflow: 'visible'
  },
  results: {
    backgroundColor: 'white',
    position: Platform.OS === 'web' ? 'absolute' : 'relative',
    top: 5,
    borderRadius: 3,
    width: '100%',
    borderWidth: 1
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
