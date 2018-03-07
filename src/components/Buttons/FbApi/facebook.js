import { Facebook } from 'expo'
import React from 'react'
import { AsyncStorage } from 'react-native'

import { pure, compose, withHandlers, mapProps } from 'recompose'

export default Button =>
  compose(
    withHandlers({
      onPress: props => async (playlistId, e) => {
        const {
          type,
          token
        } = await Facebook.logInWithReadPermissionsAsync('354324435015552', {
          permissions: ['public_profile', 'email', 'user_friends']
          // behavior: 'native'
        })
        console.log('✨type', type)
        if (type === 'success') {
          console.log('✨props, props.verifyUser', props, props.verifyUser)
          props.verifyUser(token)
          // const res = await this.props.authenticateUserWithGraphCool(token)
          console.log('✨going', res)
        }
      }
    }),
    pure
  )(Button)

// export default Button =>
//   class extends React.Component {
//     async handleFBLogin() {
//       const {
//         type,
//         token
//       } = await Facebook.logInWithReadPermissionsAsync('354324435015552', {
//         permissions: ['public_profile', 'email', 'user_friends']
//         // behavior: 'native'
//       })
//       if (type === 'success') {
//         props.verifyUser(facebookToken)
//         const res = await this.props.authenticateUserWithGraphCool(token)
//         console.log('✨going', res)
//       }
//     }
//
//     render() {
//       return <Button {...this.props} onPress={() => this.handleFBLogin()} />
//     }
//   }

// const FbLoginComposer = Button =>
//   compose(
//     inject('userStore'),
//     observer,
//     withHandlers({
//       addToPlaylist: props => (playlistId, e) => {
//         const { mutate, close, episodeId } = props
//         mutate({ variables: { playlistId, episodeId } })
//         close(e)
//       },
//       update: props => e => {
//         props.setPlaylistName(e)
//       }
//     }),
//     pure
//   )(Button)
