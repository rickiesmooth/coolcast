import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { FlatList } from '../utils'
import { observable, action, computed, reaction } from 'mobx'
import { Search, SearchResults } from '../components/Search'
import { observer, inject } from 'mobx-react'
import { Row } from '../components/Rows'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

@inject('userStore', 'currentStore', 'podcastStore')
@observer
export default class HomeScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Home'
  }

  render() {
    // row history
    // row likes
    // row starred

    return this.props.userStore.currentUser.history ? (
      <Row data={this.props.userStore.currentUser.history} />
    ) : null
  }
}

//
// import React from 'react'
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
// import { FlatList } from '../utils'
// import { observable, action, computed, reaction } from 'mobx'
// import { Search, SearchResults } from '../components/Search'
// import { observer, inject } from 'mobx-react'
// import { Row } from '../components/Rows'
// import gql from 'graphql-tag'
// import { graphql } from 'react-apollo'
//
// @inject('userStore', 'currentStore', 'podcastStore')
// @observer
// class HomeScreen extends React.Component {
//   static navigationOptions = {
//     tabBarLabel: 'Home'
//   }
//
//   render() {
//     return this.props.userStore.currentUserHistory ? (
//       <Row data={this.props.userStore.currentUserHistory} />
//     ) : null
//   }
// }
//
// const FETCH_USER_HISTORY = gql`
//   query {
//     user {
//       id
//       history {
//         id
//         progress
//         episode {
//           title
//           id
//           src
//           plays {
//             id
//             progress
//           }
//           show {
//             showId
//           }
//         }
//       }
//     }
//   }
// `
//
// export default graphql(FETCH_USER_HISTORY)(HomeScreen)
