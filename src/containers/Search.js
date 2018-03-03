import React from 'react'
import { View, Platform } from 'react-native'
import { computed, action, observable } from 'mobx'
import { observer, inject } from 'mobx-react'

import { pure, compose, withHandlers, withState, mapProps } from 'recompose'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

export const SearchInputComposer = SearchInput => {
  return compose(
    inject('searchStore'),
    observer,
    withHandlers({
      onTextInputChange: props => async value => {
        props.searchStore.searchPodcast(value)
      }
    })
  )(SearchInput)
}

export const SearchResultsComposer = SearchResults => {
  return compose(
    inject('searchStore'),
    observer,
    mapProps(({ searchStore, isHidden, ...rest }) => ({
      get results() {
        return searchStore.searchResults
      },
      get isHidden() {
        return !this.results || isHidden
      },
      searchStore,
      isHidden,
      ...rest
    }))
  )(SearchResults)
}

export const SearchInputWithResultsComposer = SearchInputWithResults =>
  compose(
    inject('searchStore'),
    withState('hidden', 'setHidden', true),
    withHandlers({
      toggleSearchResults: props => val => {
        if (Platform.OS === 'web') {
          props.setHidden(val)
        }
      }
    })
  )(SearchInputWithResults)

// class Enhanced extends React.Component {
//   @observable hidden = true
//
//   @action
//   toggleSearchResults = val => {
//     if (Platform.OS === 'web') {
//       this.hidden = val
//     }
//   }
//
//   @computed
//   get isHidden() {
//     return this.hidden
//   }
//
//   render() {
//     return (
//       <SearchInputWithResults
//         {...this.props}
//         toggleSearchResults={this.toggleSearchResults}
//         isHidden={this.isHidden}
//       />
//     )
//   }
// }
