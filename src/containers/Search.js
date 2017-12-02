import React from 'react'
import { View, Platform } from 'react-native'
import { computed, action } from 'mobx'
import { observer, inject } from 'mobx-react'

export const SearchInputComposer = SearchInput =>
  @inject('currentStore', 'podcastStore')
  @observer
  class Enhanced extends React.Component {
    onTextInputChange = value => this.props.podcastStore.searchPodcast(value)

    @action
    toggleSearchResults = val => {
      if (Platform.OS === 'web') {
        this.props.currentStore.hideSearchResults = val
      }
    }
    render() {
      return (
        <SearchInput
          {...this.props}
          toggleSearchResults={this.toggleSearchResults}
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
      // podcastStore.getPodcastEpisodes(podcast)
    }
    render() {
      return !this.results ||
        this.props.currentStore.hideSearchResults ? null : (
        <SearchResults
          {...this.props}
          results={this.results}
          setCurrentPodcast={this._setCurrentPodcast}
        />
      )
    }
  }
