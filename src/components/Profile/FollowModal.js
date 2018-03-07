import React from 'react'
import { View, Image, Text, StyleSheet } from 'react-native'

import { pure, compose } from 'recompose'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { FlatList } from '../../utils'
import { Link } from '../../navigation'

const FollowModalPure = props => {
  const { data: { loading, user, type } } = props
  if (loading) {
    return <Text>Loading</Text>
  } else {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          contentContainerStyle={styles.contentContainer}
          data={user.followers || user.following}
          keyExtractor={({ id }) => id}
          renderItem={({ item }) => {
            return (
              <Link to={`/user/${item.id}`}>
                <Text>{item.name}</Text>
              </Link>
            )
          }}
        />
      </View>
    )
  }
}

const data = graphql(
  gql`
    query FollowerQuery($userId: ID!) {
      user(userId: $userId) {
        id
        followers {
          id
          name
          fbid
        }
      }
    }
  `,
  {
    options: props => ({
      variables: { userId: props.userId }
    })
  }
)

export const FollowModal = compose(data, pure)(FollowModalPure)

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  thumb: {
    height: 100,
    width: 100,
    borderRadius: 50
  }
})
