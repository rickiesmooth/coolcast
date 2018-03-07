import React from 'react'
import { Platform } from 'react-native'
import { observer, inject } from 'mobx-react'

import { pure, compose, withHandlers, withState, mapProps } from 'recompose'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

const API_URL = 'https://itunes.apple.com'

export const SearchInputComposer = SearchInput => {
  return compose(
    withHandlers({
      onTextInputChange: props => async value => {
        props.searchStore.searchPodcast(value)
      }
    }),
    pure
  )(SearchInput)
}

export const SearchResultsComposer = SearchResults => {
  return compose(
    mapProps(({ searchStore, isHidden, ...rest }) => ({
      results: searchStore.searchResults,
      isHidden: !this.results || isHidden,
      searchStore,
      isHidden,
      ...rest
    })),
    pure
  )(SearchResults)
}

export const SearchInputWithResultsComposer = SearchInputWithResults =>
  compose(
    withState('hidden', 'setHidden', Platform.OS === 'web' ? true : false),
    withState('results', 'setResults', {}),
    withState('query', 'setQuery', ''),
    withHandlers({
      onInput: ({ query, setResults, results, setQuery }) => async val => {
        setQuery(val)
        const apiSearchResults = await fetch(
          `${API_URL}/search?term=${encodeURIComponent(
            query
          )}&entity=podcast&limit=10`
        ).then(response => response.json())
        apiSearchResults.results.forEach(item => {
          const key = item.collectionId
          if (!results[key] && item.feedUrl) {
            setResults(
              Object.assign(results, {
                [key]: {
                  id: key.toString(),
                  title: item.trackName,
                  feedUrl: item.feedUrl,
                  thumb: item.artworkUrl60
                }
              })
            )
          }
        })
      },
      toggleSearchResults: ({ setHidden }) => val =>
        Platform.OS === 'web' && setHidden(val)
    }),
    pure
  )(SearchInputWithResults)
