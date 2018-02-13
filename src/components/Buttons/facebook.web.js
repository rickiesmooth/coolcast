import React from 'react'
import { AsyncStorage } from 'react-native'

export default Button =>
  class extends React.Component {
    componentDidMount() {
      this._initializeFacebookSDK()
    }
    _facebookCallback = async facebookResponse => {
      if (facebookResponse.status === 'connected') {
        const facebookToken = facebookResponse.authResponse.accessToken
        const res = await this.props.authenticateUserWithGraphCool(
          facebookToken
        )
      } else {
        console.warn(`User did not authorize the Facebook application.`)
      }
    }
    handleFBLogin = () => {
      FB.login(
        response => {
          this._facebookCallback(response)
        },
        { scope: 'public_profile,email' }
      )
    }

    _initializeFacebookSDK() {
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

    render() {
      return <Button {...this.props} onPress={() => this.handleFBLogin()} />
    }
  }
