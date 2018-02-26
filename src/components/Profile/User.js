import React from 'react'
import { View, Image, Text, StyleSheet } from 'react-native'

import { pure, compose } from 'recompose'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import { Link } from '../../navigation'
import { Title } from '../Text'
import { FbLoginButton, Button } from '../Buttons'

const UserProfileResultPure = ({
  userStore,
  isCurrentUser,
  data: { loading, user }
}) => {
  if (loading) {
    return <Text>Loading</Text>
  } else {
    const { fbid, name, id, following, followers } = user
    return (
      <View style={styles.container}>
        <Image
          style={styles.thumb}
          source={{
            uri: `https://graph.facebook.com/${fbid}/picture?type=large`
          }}
        />
        <Title text={name} size="large" />
        <View style={{ flexDirection: 'row' }}>
          <Link
            to={{
              pathname: '/modal/Follow',
              state: { modal: true, following: id }
            }}
          >
            <Title
              text={`${following.length} following`}
              size={'large'}
              style={{
                marginRight: 20
              }}
            />
          </Link>
          <Link
            to={{
              pathname: '/modal/Follow',
              state: { modal: true, followers: id }
            }}
          >
            <Title
              text={`${followers.length} followers`}
              size={'large'}
              style={{
                marginRight: 20
              }}
            />
          </Link>
        </View>
        {isCurrentUser ? (
          <Button title={'Logout'} onPress={userStore.logout} />
        ) : (
          <Button title={'Follow'} onPress={() => userStore.follow(id)} />
        )}
      </View>
    )
  }
}

const data = graphql(
  gql`
    query UserQuery($userId: ID!) {
      user(userId: $userId) {
        id
        name
        fbid
        followers {
          id
        }
        following {
          id
        }
      }
    }
  `,
  {
    options: props => ({
      variables: { userId: props.navigationKey || props.currentUser.id }
    })
  }
)

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

export const User = compose(data, pure)(UserProfileResultPure)
