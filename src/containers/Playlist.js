import React from 'react'
import { ActivityIndicator } from 'react-native'
import { observer, inject } from 'mobx-react'

import { pure, compose, withHandlers, mapProps, withState } from 'recompose'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

export const PlaylistItemComposer = PlaylistComponent =>
  compose(
    observer,
    graphql(removeMutation),
    graphql(data, {
      options: ({ playlistId }) => ({ variables: { playlistId } })
    }),
    withState('editing', 'setEditing', false),
    withHandlers({
      editPlaylist: ({ editing, setEditing }) => e => setEditing(!editing),
      removePlaylist: props => e => {
        const { mutate, playlistId } = props
        mutate({ variables: { id: playlistId } })
      }
    })
  )(PlaylistComponent)

export const CreatePlaylistComposer = CreatePlaylistComponent =>
  compose(
    inject('userStore'),
    observer,
    graphql(addMutation),
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
    })
  )(CreatePlaylistComponent)

export const AddToPlaylistComposer = AddToPlaylistComponent =>
  compose(
    inject('userStore'),
    observer,
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
    })
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
