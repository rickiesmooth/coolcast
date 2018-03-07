import React from 'react'
import { AsyncStorage } from 'react-native'

import { pure, compose, withHandlers, lifecycle, mapProps } from 'recompose'

export default Button =>
  compose(
    withHandlers({
      onPress: props => (playlistId, e) => {
        FB.login(
          response => {
            if (response.status === 'connected') {
              const facebookToken = response.authResponse.accessToken
              props.verifyUser(facebookToken)
            } else {
              console.warn(`User did not authorize the Facebook application.`)
            }
          },
          { scope: 'public_profile, email, user_friends' }
        )
      }
    }),
    lifecycle({
      componentDidMount() {
        window.fbAsyncInit = function() {
          FB.init({
            appId: '354324435015552',
            cookie: true,
            xfbml: true,
            version: 'v2.10'
          })

          FB.AppEvents.logPageView()
        }
        ;(function(d, s, id) {
          var js,
            fjs = d.getElementsByTagName(s)[0]
          if (d.getElementById(id)) {
            return
          }
          js = d.createElement(s)
          js.id = id
          js.src = 'https://connect.facebook.net/en_US/sdk.js'
          fjs.parentNode.insertBefore(js, fjs)
        })(document, 'script', 'facebook-jssdk')
      }
    }),
    pure
  )(Button)
