import React from 'react'
import { ActivityIndicator } from 'react-native'
import { observer, inject } from 'mobx-react'

import { pure, compose, withHandlers, mapProps, withState } from 'recompose'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import { UserQuery } from './Page'

export const PlaylistItemComposer = PlaylistComponent =>
  compose(
    graphql(removeMutation, {
      options: {
        refetchQueries: [{ query: UserQuery }] // <-- new
      }
    }),
    withState('editing', 'setEditing', false),
    withHandlers({
      editPlaylist: ({ editing, setEditing }) => e => setEditing(!editing),
      removePlaylist: props => e => {
        const { mutate, playlistId } = props
        mutate({ variables: { id: playlistId } })
      }
    }),
    pure
  )(PlaylistComponent)

export const PlaylistPageComposer = Page =>
  compose(
    graphql(data, {
      options: ({ navigationKey }) => {
        return { variables: { playlistId: navigationKey } }
      }
    }),
    pure
  )(Page)

export const CreatePlaylistComposer = CreatePlaylistComponent =>
  compose(
    inject('userStore'),
    graphql(addMutation, {
      options: {
        refetchQueries: [{ query: UserQuery }] // <-- new
      }
    }),
    withState('playlistName', 'setPlaylistName', null),
    withHandlers({
      submit: ({ mutate, playlistName, userStore, close }) => e => {
        close(e)
        mutate({
          variables: {
            name: playlistName,
            author: userStore.currentUser.id
          }
        })
      },
      update: props => e => props.setPlaylistName(e)
    }),
    pure
  )(CreatePlaylistComponent)

export const AddToPlaylistComposer = AddToPlaylistComponent =>
  compose(
    graphql(addToPlaylistMutation),
    graphql(playlistsQuery),
    withState('playlistName', 'setPlaylistName', null),
    withHandlers({
      addToPlaylist: props => (playlistId, e) => {
        const { mutate, close, episodeId } = props
        mutate({ variables: { playlistId, episodeId } })
        close(e)
      },
      update: props => e => {
        props.setPlaylistName(e)
      }
    }),
    pure
  )(AddToPlaylistComponent)

const addMutation = gql`
  mutation AddPlaylist($name: String!) {
    addPlaylist(name: $name) {
      id
    }
  }
`

const removeMutation = gql`
  mutation RemovePlaylist($id: ID!) {
    removePlaylist(id: $id) {
      id
    }
  }
`

const addToPlaylistMutation = gql`
  mutation UpdatePlaylist($playlistId: ID!, $episodeId: ID!) {
    updatePlaylist(playlistId: $playlistId, episodeId: $episodeId) {
      id
    }
  }
`

const playlistsQuery = gql`
  query myPlaylists {
    me {
      id
      playlists {
        id
        name
      }
    }
  }
`

const data = gql`
  query GetPlaylist($playlistId: ID!) {
    playlist(id: $playlistId) {
      id
      name
      user {
        id
        name
        fbid
      }
      episodes {
        id
        title
      }
    }
  }
`
