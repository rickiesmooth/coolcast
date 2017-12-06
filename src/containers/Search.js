import React from 'react'
import { View, Platform } from 'react-native'
import { computed, action, observable } from 'mobx'
import { observer, inject } from 'mobx-react'

export const SearchInputComposer = SearchInput =>
  @inject('currentStore', 'podcastStore')
  @observer
  class Enhanced extends React.Component {
    onTextInputChange = value => this.props.podcastStore.searchPodcast(value)
    render() {
      return (
        <SearchInput
          {...this.props}
          _toggleSearchResults={this.props.toggleSearchResults}
          onTextInputChange={this.onTextInputChange}
          query={this.props.podcastStore.query}
          placeholder={'Search...'}
        />
      )
    }
  }

export const SearchResultsComposer = SearchResults =>
  @inject('currentStore', 'podcastStore')
  @observer
  class Enhanced extends React.Component {
    @computed
    get results() {
      return this.props.podcastStore.results
    }
    _setCurrentPodcast = async podcast => {
      const { currentStore, podcastStore } = this.props
      await podcastStore.getCurrentPodcast({ key: podcast.key })
      currentStore.setCurrentPodcast(podcast)
    }
    render() {
      return !this.results || this.props.isHidden ? null : (
        <SearchResults
          {...this.props}
          results={this.results}
          setCurrentPodcast={this._setCurrentPodcast}
        />
      )
    }
  }

export const SearchInputWithResultsComposer = SearchInputWithResults =>
  @inject('currentStore', 'podcastStore')
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
