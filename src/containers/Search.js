import React from 'react'
import { View, Platform } from 'react-native'
import { computed, action, observable } from 'mobx'
import { observer, inject } from 'mobx-react'

export const SearchInputComposer = SearchInput =>
  @inject('podcastStore', 'searchStore')
  @observer
  class Enhanced extends React.Component {
    onTextInputChange = value => this.props.searchStore.searchPodcast(value)
    render() {
      return (
        <SearchInput
          {...this.props}
          toggleSearchResults={this.props.toggleSearchResults}
          onTextInputChange={this.onTextInputChange}
          query={this.props.searchStore.query}
          placeholder={'Search...'}
        />
      )
    }
  }

export const SearchResultsComposer = SearchResults =>
  @inject('searchStore', 'podcastStore', 'apolloStore')
  @observer
  class Enhanced extends React.Component {
    @computed
    get results() {
      return this.props.searchStore.searchResults
    }
    render() {
      return !this.results || this.props.isHidden ? null : (
        <SearchResults {...this.props} results={this.results} />
      )
    }
  }

export const SearchInputWithResultsComposer = SearchInputWithResults =>
  @inject('userStore', 'podcastStore')
  @observer
  class Enhanced extends React.Component {
    @observable hidden = true

    @action
    toggleSearchResults = val => {
      if (Platform.OS === 'web') {
        this.hidden = val
      }
    }

    @computed
    get isHidden() {
      return this.hidden
    }

    render() {
      return (
        <SearchInputWithResults
          {...this.props}
          toggleSearchResults={this.toggleSearchResults}
          isHidden={this.isHidden}
        />
      )
    }
  }
